import { describe, expect, it } from "vitest";
import { getAllAgents } from "../../src/templates/kimi/index.js";

import { collectKimiTemplates } from "../../src/configurators/kimi.js";
import { collectPiTemplates } from "../../src/configurators/pi.js";

const EXPECTED_AGENT_NAMES = [];

describe("kimi getAllAgents", () => {
  it("returns the expected agent prompt set", () => {
    const agents = getAllAgents();
    const names = agents.map((agent) => agent.name);
    expect(names).toEqual(EXPECTED_AGENT_NAMES);
  });

  it("each agent is a Markdown file with YAML frontmatter (Kimi SKILL.md requires name + description)", () => {
    for (const agent of getAllAgents()) {
      const content = agent.content.replace(/\r\n/g, "\n");
      expect(content.length).toBeGreaterThan(0);
      expect(content).toMatch(/^---\n/);
      expect(content).toContain("name: ");
      expect(content).toContain("description:");
      // Kimi agents document dispatch through `.kimi-code/agents/` sub-agents
      expect(content).toContain(".kimi-code/agents/");
    }
  });

  it("documents dispatch via the Agent tool with an Active task: prompt", () => {
    for (const agent of getAllAgents()) {
      // Dispatch contract: main session dispatches the custom sub-agent via
      // the Agent tool, and the prompt starts with the active task path.
      expect(agent.content).toContain(
        `dispatches the \`${agent.name}\` sub-agent via the Agent tool`,
      );
      expect(agent.content).toContain("Starts with `Active task: <path");
    }
  });
});

describe("kimi collectKimiTemplates", () => {
  it("writes workflow + bundled skills to the shared .agents/skills/ root", () => {
    const files = collectKimiTemplates();
    expect(files.has(".agents/skills/trellis-brainstorm/SKILL.md")).toBe(true);
    expect(files.has(".agents/skills/trellis-before-dev/SKILL.md")).toBe(true);
    expect(files.has(".agents/skills/trellis-meta/SKILL.md")).toBe(true);
    // Command-as-skill files stay Kimi-private (Codex owns the shared
    // trellis-start/continue/finish-work fallback copies).
    expect(files.has(".agents/skills/trellis-start/SKILL.md")).toBe(false);
    expect(files.has(".agents/skills/trellis-finish-work/SKILL.md")).toBe(
      false,
    );
  });

  it("renders .agents/skills/ files byte-identically to Pi's shared writes", () => {
    const kimiFiles = collectKimiTemplates();
    const piFiles = collectPiTemplates();
    for (const [key, content] of kimiFiles) {
      if (!key.startsWith(".agents/skills/")) continue;
      expect(
        piFiles.get(key),
        `${key} must be byte-identical to Pi's shared-skill write`,
      ).toBe(content);
    }
  });
});
