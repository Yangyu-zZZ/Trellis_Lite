import { describe, expect, it } from "vitest";
import { getAllAgents } from "../../src/templates/grok/index.js";

import { collectGrokTemplates } from "../../src/configurators/grok.js";

const EXPECTED_AGENT_NAMES = [];

describe("grok getAllAgents", () => {
  it("returns the expected custom agent set", () => {
    const agents = getAllAgents();
    const names = agents.map((agent) => agent.name);
    expect(names).toEqual(EXPECTED_AGENT_NAMES);
  });

  it("each agent is a Markdown file with YAML frontmatter", () => {
    for (const agent of getAllAgents()) {
      const content = agent.content.replace(/\r\n/g, "\n");
      expect(content.length).toBeGreaterThan(0);
      expect(content).toMatch(/^---\n/);
      expect(content).toContain("name: ");
      expect(content).toContain("description:");
      // Grok agents document spawn_subagent dispatch (not Claude Task tools)
      expect(content).toContain("spawn_subagent");
    }
  });
});

describe("grok collectGrokTemplates", () => {
  it("includes private skills under .grok/skills/", () => {
    const files = collectGrokTemplates();
    expect(files.has(".grok/skills/trellis-brainstorm/SKILL.md")).toBe(true);
    expect(files.has(".grok/skills/trellis-before-dev/SKILL.md")).toBe(true);
  });
});
