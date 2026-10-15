import { describe, expect, it } from "vitest";
import {
  getAllAgents,
  getHooksConfig,
} from "../../src/templates/zcode/index.js";

const EXPECTED_AGENT_NAMES = [];

describe("zcode getAllAgents", () => {
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
      expect(content).toContain("color:");
    }
  });
});

describe("zcode getHooksConfig", () => {
  it("targets .zcode/config.json (workspace config form)", () => {
    const cfg = getHooksConfig();
    expect(cfg.targetPath).toBe("config.json");
    expect(cfg.content.length).toBeGreaterThan(0);
  });
});
