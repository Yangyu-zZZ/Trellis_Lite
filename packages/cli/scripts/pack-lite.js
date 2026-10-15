#!/usr/bin/env node
/** Prepare independently named Lite tarballs without changing workspace imports. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const registry = "https://registry.npmjs.org/";

export function resolveNpmCli() {
  const candidates = [
    process.env.npm_execpath?.endsWith("npm-cli.js")
      ? process.env.npm_execpath
      : null,
  ];
  for (const dir of [
    path.dirname(process.execPath),
    ...(process.env.PATH ?? "").split(path.delimiter),
  ]) {
    candidates.push(
      path.join(dir, "node_modules/npm/bin/npm-cli.js"),
      path.resolve(dir, "../lib/node_modules/npm/bin/npm-cli.js"),
    );
    const executable = path.join(dir, "npm");
    if (fs.existsSync(executable)) {
      const resolved = fs.realpathSync(executable);
      if (resolved.endsWith("npm-cli.js")) candidates.push(resolved);
    }
  }
  const result = candidates.find(
    (candidate) => candidate && fs.existsSync(candidate),
  );
  if (!result)
    throw new Error("npm-cli.js not found. Install npm alongside Node.js.");
  return result;
}

export function prepareLitePackages(scope, outputDir) {
  scope = scope.replace(/^@/, "");
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(scope) || scope === "mindfoldhq") {
    throw new Error("Use your own lowercase npm scope (not mindfoldhq).");
  }
  const readPackage = (name) =>
    JSON.parse(
      fs.readFileSync(
        path.join(repoRoot, "packages", name, "package.json"),
        "utf8",
      ),
    );
  const cli = readPackage("cli");
  const core = readPackage("core");
  if (cli.version !== core.version)
    throw new Error("CLI and core versions must match.");
  const coreName = `@${scope}/trellis-lite-core`;
  const cliName = `@${scope}/trellis-lite`;
  const stagingRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "trellis-lite-package-"),
  );
  fs.mkdirSync(outputDir, { recursive: true });
  const packages = [];
  try {
    for (const [kind, original, name] of [
      ["core", core, coreName],
      ["cli", cli, cliName],
    ]) {
      const source = path.join(repoRoot, "packages", kind);
      const target = path.join(stagingRoot, kind);
      fs.mkdirSync(target);
      // Explicitly copy distributable files; workspace state and credentials never enter staging.
      for (const entry of ["dist", "src", ...(kind === "cli" ? ["bin"] : [])]) {
        fs.cpSync(path.join(source, entry), path.join(target, entry), {
          recursive: true,
          filter: (file) =>
            path.basename(file) !== "__pycache__" && !file.endsWith(".pyc"),
        });
      }
      if (!fs.existsSync(path.join(target, "dist/index.js")))
        throw new Error("Run pnpm build before packing.");
      for (const entry of ["LICENSE", "README.md", "README_CN.md"]) {
        fs.copyFileSync(path.join(repoRoot, entry), path.join(target, entry));
      }
      const {
        scripts: _scripts,
        devDependencies: _devDependencies,
        private: _private,
        ...metadata
      } = original;
      metadata.name = name;
      metadata.files = [
        "dist",
        "src",
        "LICENSE",
        "README.md",
        "README_CN.md",
        ...(kind === "cli" ? ["bin"] : []),
      ];
      metadata.publishConfig = { access: "public", registry };
      metadata.repository = {
        ...metadata.repository,
        url: "git+https://github.com/Yangyu-zZZ/Trellis_Lite.git",
        directory: `packages/${kind}`,
      };
      metadata.homepage = "https://github.com/Yangyu-zZZ/Trellis_Lite#readme";
      if (kind === "cli") {
        // npm aliases keep compiled imports working while resolving only the Lite core.
        metadata.dependencies = {
          ...metadata.dependencies,
          [core.name]: `npm:${coreName}@${core.version}`,
        };
      }
      fs.writeFileSync(
        path.join(target, "package.json"),
        JSON.stringify(metadata, null, 2) + "\n",
      );
      // npm_execpath is supplied by npm/pnpm. Resolve npm via Node to avoid .cmd shell quoting on Windows.
      const packed = JSON.parse(
        execFileSync(
          process.execPath,
          [
            resolveNpmCli(),
            "pack",
            "--json",
            "--ignore-scripts",
            "--pack-destination",
            path.resolve(outputDir),
          ],
          {
            cwd: target,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "inherit"],
          },
        ),
      )[0];
      if (packed.name !== name || packed.version !== cli.version)
        throw new Error("Unexpected packed identity.");
      packages.push({
        kind,
        name,
        version: packed.version,
        filename: packed.filename,
        integrity: packed.integrity,
        size: packed.size,
        files: packed.files.length,
      });
    }
    const manifest = {
      version: cli.version,
      tag: cli.version.includes("-")
        ? cli.version.split("-")[1].split(".")[0]
        : "latest",
      registry,
      packages,
    };
    fs.writeFileSync(
      path.join(outputDir, "release.json"),
      JSON.stringify(manifest, null, 2) + "\n",
    );
    return manifest;
  } finally {
    fs.rmSync(stagingRoot, { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { values } = parseArgs({
    options: {
      scope: { type: "string" },
      "out-dir": { type: "string", default: "artifacts/npm" },
    },
  });
  if (!values.scope)
    throw new Error(
      "Usage: node packages/cli/scripts/pack-lite.js --scope <npm-user> [--out-dir <directory>]",
    );
  console.log(
    JSON.stringify(
      prepareLitePackages(values.scope, path.resolve(values["out-dir"])),
      null,
      2,
    ),
  );
}
