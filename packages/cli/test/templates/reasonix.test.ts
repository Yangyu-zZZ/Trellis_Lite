import { describe, expect, it } from "vitest";

import { getAllAgents } from "../../src/templates/reasonix/index.js";

// Reasonix ships skills-only; subagent skills carry `runAs: subagent`
// frontmatter so Reasonix spawns them as isolated subagent loops.
const EXPECTED_AGENT_NAMES = [];

describe("reasonix getAllAgents", () => {
  it("returns the expected agent set", () => {
    const agents = getAllAgents();
    const names = agents.map((a) => a.name).sort();
    expect(names).toEqual(EXPECTED_AGENT_NAMES);
  });
});
