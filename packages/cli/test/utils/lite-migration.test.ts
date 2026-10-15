import { describe, expect, it } from "vitest";
import { retireLiteConfig } from "../../src/utils/lite-migration.js";

describe("Lite config retirement", () => {
  it.each([
    ".claude/settings.json",
    ".cursor/hooks.json",
    ".codex/hooks.json",
    ".codebuddy/settings.json",
    ".factory/settings.json",
    ".zcode/config.json",
  ])("removes only retired registrations from %s", (file) => {
    const input = JSON.stringify({
      custom: { enabled: true },
      hooks: {
        SessionStart: [
          {
            hooks: [
              {
                type: "command",
                command: "python .claude/hooks/session-start.py",
              },
            ],
          },
        ],
        PreToolUse: [
          {
            matcher: "Agent|Task",
            hooks: [
              {
                type: "command",
                command:
                  'python "$ROOT/.claude/hooks/inject-subagent-context.py"',
              },
              { type: "command", command: "echo custom" },
            ],
          },
        ],
      },
    });
    const result = retireLiteConfig(file, input);
    expect(result).not.toContain("inject-subagent-context.py");
    expect(JSON.parse(result)).toEqual({
      custom: { enabled: true },
      hooks: {
        SessionStart: [
          {
            hooks: [
              {
                type: "command",
                command: "python .claude/hooks/session-start.py",
              },
            ],
          },
        ],
        PreToolUse: [
          {
            matcher: "Agent|Task",
            hooks: [{ type: "command", command: "echo custom" }],
          },
        ],
      },
    });
    expect(retireLiteConfig(file, result)).toBe(result);
  });

  it("removes an empty registration group", () => {
    const input =
      '{"hooks":{"SubagentStart":[{"hooks":[{"command":"python .codex/hooks/inject-subagent-context.py"}]}]}}';
    expect(JSON.parse(retireLiteConfig(".codex/hooks.json", input))).toEqual({
      hooks: { SubagentStart: [] },
    });
  });

  it("leaves malformed, unrelated, and similarly named commands untouched", () => {
    for (const input of [
      "{broken",
      '{"command":"echo inject-subagent-context.py.backup"}',
      '{"command":"echo hello"}',
    ]) {
      expect(retireLiteConfig(".claude/settings.json", input)).toBe(input);
    }
    expect(
      retireLiteConfig(
        "custom.json",
        '{"command":"python .claude/hooks/inject-subagent-context.py"}',
      ),
    ).toContain("inject-subagent-context.py");
  });

  it("removes the shipped Codex depth override while preserving user tables/keys", () => {
    const input =
      '# Project config\n# Pin the subagent recursion depth explicitly instead of relying on defaults.\n# Trellis comment\n[agents]\nmax_depth = 1\nuser_key = "keep"\n[other]\nmax_depth = 1\n';
    const result = retireLiteConfig(".codex/config.toml", input);
    expect(result).toBe(
      '# Project config\n[agents]\nuser_key = "keep"\n[other]\nmax_depth = 1\n',
    );
    expect(
      retireLiteConfig(".codex/config.toml", "[agents]\nmax_depth = 7\n"),
    ).toBe("[agents]\nmax_depth = 7\n");
  });
});
