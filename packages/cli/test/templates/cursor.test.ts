import { describe, expect, it } from "vitest";

import { getAllAgents } from "../../src/templates/cursor/index.js";

const EXPECTED_AGENT_NAMES = [];

describe("cursor getAllAgents", () => {
  it("returns the expected agent set", () => {
    const agents = getAllAgents();
    const names = agents.map((a) => a.name).sort();
    expect(names).toEqual(EXPECTED_AGENT_NAMES);
  });
});
