#!/usr/bin/env node
/** Wait for public registry visibility, then verify the exact prepared artifacts. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { setTimeout } from "node:timers/promises";

async function registryJSON(endpoint, deadline) {
  let response;
  try {
    response = await fetch(endpoint, {
      headers: { "cache-control": "no-cache" },
      signal: AbortSignal.timeout(
        Math.max(1, Math.min(15000, deadline - Date.now())),
      ),
    });
  } catch {
    return null;
  }
  if (
    response.status === 404 ||
    response.status === 429 ||
    response.status >= 500
  )
    return null;
  if (!response.ok)
    throw new Error(
      `Registry returned HTTP ${response.status} for ${endpoint}`,
    );
  return response.json();
}

export async function verifyLiteRelease(
  release,
  { timeoutSeconds = 1200, intervalSeconds = 30 } = {},
) {
  if (
    !Number.isFinite(timeoutSeconds) ||
    timeoutSeconds <= 0 ||
    !Number.isFinite(intervalSeconds) ||
    intervalSeconds <= 0
  ) {
    throw new Error("Timeout and interval must be positive seconds.");
  }
  const deadline = Date.now() + timeoutSeconds * 1000;
  const verified = new Set();
  while (Date.now() < deadline) {
    for (const pkg of release.packages) {
      if (verified.has(pkg.name)) continue;
      const endpoint = new URL(
        `${pkg.name.replace("/", "%2f")}/${pkg.version}`,
        release.registry,
      );
      const published = await registryJSON(endpoint, deadline);
      if (!published) continue;
      if (
        published.name !== pkg.name ||
        published.version !== pkg.version ||
        published.dist?.integrity !== pkg.integrity
      ) {
        throw new Error(
          `${pkg.name}: published identity or integrity differs from the prepared tarball`,
        );
      }
      if (pkg.kind === "cli") {
        const core = release.packages.find((entry) => entry.kind === "core");
        if (
          !core ||
          published.dependencies?.["@mindfoldhq/trellis-core"] !==
            `npm:${core.name}@${core.version}`
        ) {
          throw new Error("Published CLI does not pin the prepared Lite core");
        }
      }
      const tags = await registryJSON(
        new URL(
          `-/package/${pkg.name.replace("/", "%2f")}/dist-tags`,
          release.registry,
        ),
        deadline,
      );
      if (tags?.[release.tag] !== pkg.version) continue;
      verified.add(pkg.name);
      console.log(
        `Verified public ${pkg.name}@${pkg.version} and tarball integrity`,
      );
    }
    if (verified.size === release.packages.length) return;
    console.log(
      `Waiting for npm visibility: ${verified.size}/${release.packages.length} packages ready`,
    );
    await setTimeout(
      Math.max(0, Math.min(intervalSeconds * 1000, deadline - Date.now())),
    );
  }
  throw new Error(
    "Timed out waiting for npm visibility; inspect publication/scanning status before retrying. Do not republish the same version.",
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { values } = parseArgs({
    options: {
      manifest: { type: "string", default: "artifacts/npm/release.json" },
      "timeout-seconds": { type: "string", default: "1200" },
      "interval-seconds": { type: "string", default: "30" },
    },
  });
  const release = JSON.parse(fs.readFileSync(values.manifest, "utf8"));
  await verifyLiteRelease(release, {
    timeoutSeconds: Number(values["timeout-seconds"]),
    intervalSeconds: Number(values["interval-seconds"]),
  });
}
