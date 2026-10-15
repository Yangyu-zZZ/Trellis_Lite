import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  collectPlatformTemplates,
  PLATFORM_IDS,
} from "../src/configurators/index.js";
import {
  getAllScripts,
  workflowMdTemplate,
  getAllAgents,
} from "../src/templates/trellis/index.js";
import { AI_TOOLS } from "../src/types/ai-tools.js";
import {
  setResolvedPythonCommand,
  resetResolvedPythonCommand,
} from "../src/configurators/shared.js";

afterEach(() => {
  resetResolvedPythonCommand();
});

describe("Lite multi-tool contract", () => {
  it.each(["python3", "python"])(
    "keeps all 22 adapters without default roles, check skill, or agent hook (%s)",
    (python) => {
      setResolvedPythonCommand(python);
      expect(PLATFORM_IDS).toHaveLength(22);
      for (const id of PLATFORM_IDS) {
        const files = collectPlatformTemplates(id);
        expect(files?.size, id).toBeGreaterThan(0);
        for (const [name, content] of files ?? []) {
          expect(name, `${id}: ${name}`).not.toMatch(
            /(?:agents|droids)\/trellis-(?:implement|check|research)\.|skills\/trellis-(?:check|implement|research)\/|inject-subagent-context\.|beforeSubAgentStart\.json/,
          );
          if (/\.(?:json|toml)$/.test(name))
            expect(content, `${id}: ${name}`).not.toContain(
              "inject-subagent-context.py",
            );
        }
        const content = [...(files?.values() ?? [])].join("\n");
        expect(content, id).toContain("prd.md");
        expect(content, id).toContain("brainstorm");
      }
      expect(getAllAgents().size).toBe(0);
    },
  );

  it("keeps requirements discussion and optional validation in one common workflow", () => {
    expect(workflowMdTemplate).toContain("trellis-brainstorm");
    expect(workflowMdTemplate).toContain("prd.md");
    expect(workflowMdTemplate).toContain("implement directly");
    expect(workflowMdTemplate).not.toMatch(
      /trellis-(?:implement|check|research)|implement\.jsonl|check\.jsonl|#### 2\.2/,
    );
  });

  describe("PRD-only lifecycle with legacy manifests", () => {
    let root: string;
    let run: (script: string, args: string[], key?: string) => string;
    beforeAll(() => {
      root = fs.mkdtempSync(path.join(os.tmpdir(), "trellis-lite-task-"));
      for (const [file, content] of getAllScripts()) {
        const dest = path.join(root, ".trellis/scripts", file);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, content);
      }
      const py = process.platform === "win32" ? "python" : "python3";
      run = (script, args, key = "lite_test") =>
        execFileSync(
          py,
          [path.join(root, ".trellis/scripts", script), ...args],
          {
            cwd: root,
            encoding: "utf-8",
            env: { ...process.env, PYTHONUTF8: "1", TRELLIS_CONTEXT_ID: key },
            stdio: ["pipe", "pipe", "pipe"],
          },
        );
      run("init_developer.py", ["lite-user"]);
    });
    afterAll(() => {
      if (root) fs.rmSync(root, { recursive: true, force: true });
    });
    it.each(PLATFORM_IDS)(
      "activates %s without manifest curation gates",
      (id) => {
        fs.mkdirSync(path.join(root, AI_TOOLS[id].configDir), {
          recursive: true,
        });
        const ref = run("task.py", [
          "create",
          `Lite ${id}`,
          "--slug",
          `lite-${id}`,
          "--description",
          "Implement the approved PRD",
        ])
          .trim()
          .split(/\r?\n/)
          .at(-1);
        if (!ref) throw new Error("task.py create returned no path");
        const dir = path.join(root, ref);
        expect(fs.existsSync(path.join(dir, "prd.md"))).toBe(true);
        expect(fs.existsSync(path.join(dir, "implement.jsonl"))).toBe(false);
        expect(fs.existsSync(path.join(dir, "check.jsonl"))).toBe(false);
        fs.writeFileSync(
          path.join(dir, "implement.jsonl"),
          '{"note":"legacy"}\n',
        );
        fs.writeFileSync(path.join(dir, "check.jsonl"), "");
        run("task.py", ["start", ref], `${id}_lite-test`);
        expect(
          JSON.parse(fs.readFileSync(path.join(dir, "task.json"), "utf-8"))
            .status,
        ).toBe("in_progress");
        expect(run("task.py", ["current"], `${id}_lite-test`)).toContain(
          ref.replace(/\\/g, "/"),
        );
      },
      30000,
    );
  });
});
