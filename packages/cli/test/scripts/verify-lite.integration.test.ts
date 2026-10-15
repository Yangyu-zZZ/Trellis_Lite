import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execute = promisify(execFile);
const script = fileURLToPath(
  new URL("../../scripts/verify-lite.js", import.meta.url),
);
const fixture = fs.mkdtempSync(
  path.join(os.tmpdir(), "trellis-lite-registry-test-"),
);
let registry: string;
let delayedReads = 0;
let badIntegrity = false;
let wrongTag = false;
let versionReads = 0;
const server = http.createServer((request, response) => {
  response.setHeader("content-type", "application/json");
  if (request.url?.startsWith("/-/package/")) {
    response.end(
      JSON.stringify({ latest: wrongTag ? "0.0.0-stage" : "0.6.18" }),
    );
    return;
  }
  versionReads++;
  if (delayedReads-- > 0) {
    response.statusCode = 404;
    response.end("{}");
    return;
  }
  const core = request.url?.includes("trellis-lite-core");
  response.end(
    JSON.stringify({
      name: core ? "@fixture/trellis-lite-core" : "@fixture/trellis-lite",
      version: "0.6.18",
      dist: { integrity: badIntegrity ? "unexpected" : "sha512-fixture" },
      ...(core
        ? {}
        : {
            dependencies: {
              "@mindfoldhq/trellis-core":
                "npm:@fixture/trellis-lite-core@0.6.18",
            },
          }),
    }),
  );
});

beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Missing test registry port");
  registry = `http://127.0.0.1:${address.port}/`;
  fs.writeFileSync(
    path.join(fixture, "release.json"),
    JSON.stringify({
      registry,
      tag: "latest",
      packages: [
        {
          kind: "core",
          name: "@fixture/trellis-lite-core",
          version: "0.6.18",
          integrity: "sha512-fixture",
        },
        {
          kind: "cli",
          name: "@fixture/trellis-lite",
          version: "0.6.18",
          integrity: "sha512-fixture",
        },
      ],
    }),
  );
});
beforeEach(() => {
  delayedReads = 0;
  badIntegrity = false;
  wrongTag = false;
  versionReads = 0;
});
afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  if (!path.resolve(fixture).startsWith(path.resolve(os.tmpdir()) + path.sep))
    throw new Error("Unsafe cleanup path");
  fs.rmSync(fixture, { recursive: true, force: true });
});

const run = (timeout = "2") =>
  execute(process.execPath, [
    script,
    "--manifest",
    path.join(fixture, "release.json"),
    "--timeout-seconds",
    timeout,
    "--interval-seconds",
    "0.02",
  ]);

describe("Lite public registry verification", () => {
  it("waits through scanning 404s and verifies the CLI core alias", async () => {
    delayedReads = 3;
    const { stdout } = await run();
    expect(stdout).toContain("Waiting for npm visibility");
    expect(stdout).toContain("Verified public @fixture/trellis-lite@0.6.18");
    expect(versionReads).toBeGreaterThan(3);
  });
  it("rejects a published artifact with different integrity", async () => {
    badIntegrity = true;
    await expect(run()).rejects.toMatchObject({
      stderr: expect.stringContaining("integrity differs"),
    });
  });
  it("times out if latest still points at the scan placeholder", async () => {
    wrongTag = true;
    await expect(run("0.3")).rejects.toMatchObject({
      stderr: expect.stringContaining("Timed out waiting"),
    });
  });
});
