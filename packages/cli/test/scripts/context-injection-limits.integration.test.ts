import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Legacy task-context commands remain available for existing project data.
describe("task_context.py Python compatibility", () => {
  it("avoids nested multiline f-strings rejected by Python 3.9-3.11 (#476)", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../src/templates/trellis/scripts/common/task_context.py",
      ),
      "utf-8",
    );
    expect(
      source.match(/f"[ ]{2}\{colored\(f'[^'\n]*'\s*\n\s*f?'/g) ?? [],
    ).toHaveLength(0);
  });
});
