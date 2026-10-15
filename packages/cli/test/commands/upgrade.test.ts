import { describe, expect, it, vi } from "vitest";
import { upgrade } from "../../src/commands/upgrade.js";

describe("Lite source upgrades", () => {
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
