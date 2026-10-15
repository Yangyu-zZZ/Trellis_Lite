import { describe, expect, it, vi } from "vitest";
import { upgrade } from "../../src/commands/upgrade.js";

describe("Lite source upgrades", () => {
  it("uses the installed Lite npm identity for upgrade instructions", async () => {
    vi.resetModules();
    vi.doMock("../../src/constants/version.js", () => ({
      PACKAGE_NAME: "@personal/trellis-lite",
    }));
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    try {
      const { upgrade: installedUpgrade } =
        await import("../../src/commands/upgrade.js");
      await installedUpgrade({ tag: "beta", dryRun: true });
      const text = log.mock.calls.flat().join("\n");
      expect(text).toContain(
        "npm install --global @personal/trellis-lite@beta",
      );
      expect(text).not.toContain("@mindfoldhq/trellis");
      expect(text).toContain("trellis update");
    } finally {
      log.mockRestore();
      vi.doUnmock("../../src/constants/version.js");
      vi.resetModules();
    }
  });

  it.each([{}, { dryRun: true }, { tag: "latest" }])(
    "points to the fork instead of installing upstream npm (%j)",
    async (options) => {
      const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
      try {
        await upgrade(options);
        const text = log.mock.calls.flat().join("\n");
        expect(text).toContain("https://github.com/Yangyu-zZZ/Trellis_Lite");
        expect(text).toContain("git pull --ff-only");
        expect(text).toContain("pnpm build");
        expect(text).not.toContain("npm install -g");
      } finally {
        log.mockRestore();
      }
    },
  );
});
