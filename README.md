# Trellis Lite

[中文](README_CN.md) · [Upstream Trellis](https://github.com/mindfold-ai/Trellis)

A personal fork of Trellis: discuss requirements, write a PRD, and implement in the current coding session. Specs, tasks, and journals carry project context between tools.

## What changes

| Kept                                                       | Removed from the default workflow                        |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| Requirements discussion and PRD generation                 | Dedicated Research / Implement / Check agents            |
| All 22 upstream platform adapters                          | Dedicated `trellis-check` skill                          |
| Project specs and on-demand context                        | Mandatory check / automatic repair stages                |
| Tasks, parent/child links, journals, and session isolation | Role prompt injection and mandatory role JSONL manifests |
| Multiple tools in the same project                         | Codex recursion-depth override                           |

The main session chooses how to research, implement, and validate. `design.md`, `implement.md`, and research notes are optional. Normal tests, linters, debugging, and user-defined skills remain available.

Supported tools: Claude Code, Cursor, OpenCode, Codex, Kilo CLI, Kiro, Gemini CLI, Antigravity, Devin, Qoder, CodeBuddy, GitHub Copilot, Factory Droid, DeepSeek Harness, Pi, Reasonix, ZCode, Trae, Oh My Pi, Grok Build, Kimi Code, and Snow CLI. Their existing command, skill, hook, and extension formats are preserved. Kiro's `trellis` profile remains its main entry point.

Independent utilities such as `mem`, uninstall, and explicitly requested Channel operations remain available. Lite ships no default Channel role cards and does not automatically delegate work. Choosing an external workflow with `trellis workflow` replaces the Lite workflow with that explicitly selected template.

## Install from npm

```bash
npm install --global @yangyu666/trellis-lite
trellis init --claude --codex --cursor
```

Or run without a global installation:

```bash
npx @yangyu666/trellis-lite init --claude --codex --cursor
```

Requires Node.js >=18.17, Python >=3.9, and Git. To upgrade, install the same npm package again, then run `trellis update` in your projects. The official package and Lite both provide `trellis` / `tl`; uninstall the official global CLI before replacing it with Lite.

## Build from source

Requires Node.js >=18.17, Python >=3.9, Git, and pnpm 10.32.1. The upstream `@mindfoldhq/trellis` package contains the upstream workflow; Lite uses its own npm package names.

```bash
git clone https://github.com/Yangyu-zZZ/Trellis_Lite.git
cd Trellis_Lite
corepack enable
pnpm install --frozen-lockfile
pnpm build
```

If Corepack is unavailable, use `npx --yes pnpm@10.32.1` in place of `pnpm`.

From a target project's root, run the built CLI by absolute path. Multiple platform flags can be combined:

```bash
node /absolute/path/Trellis_Lite/packages/cli/bin/trellis.js init --claude --codex --cursor
```

PowerShell example:

```powershell
$TrellisLite = 'D:\MyTrellis\packages\cli\bin\trellis.js'
Set-Location 'D:\YourProject'
node $TrellisLite init --claude --codex --cursor
```

Use the tool's `trellis-continue` command/skill to discuss requirements into `.trellis/tasks/<task>/prd.md`, then implement directly. Each tool retains its native command syntax. On platforms without startup hooks, use `trellis-start`. When switching tools, activate the same task in the new session with `task.py start <task>` and read its PRD and saved progress. Platforms without automatic shell session identity can set `TRELLIS_CONTEXT_ID` to a stable identifier unique to the current session. Each simultaneous session needs a different identifier.

## Upgrade an existing project

First update this source checkout with `git pull --ff-only`, install dependencies, and rebuild. Then run the built Lite CLI from each target project:

```bash
node /absolute/path/Trellis_Lite/packages/cli/bin/trellis.js update --dry-run
node /absolute/path/Trellis_Lite/packages/cli/bin/trellis.js update
```

The 0.6.18 migration deletes only recognized, unmodified retired templates. Customized role/check files are preserved and reported for manual review. Retired hook registrations are removed from recognized JSON configs while other settings survive. The known Trellis Codex depth override is removed; user-defined depth values survive. Tasks, specs, and journals are protected. Legacy JSONL files remain readable by the compatibility commands but no longer block activation.

Review modified workflow/skill conflicts during update to adopt the Lite flow. `update.skip` exclusions are respected and may leave an excluded configuration on its old workflow. `trellis upgrade` prints instructions for the installed Lite package or source checkout.

## Publish Lite packages

Workspace manifests retain upstream internal names for import compatibility and are private. The pack script produces separately named CLI/core tarballs and pins the CLI to the Lite core through an exact-version npm alias.

```bash
pnpm build
node packages/cli/scripts/pack-lite.js --scope yangyu666
npm login --registry https://registry.npmjs.org
npm publish artifacts/npm/yangyu666-trellis-lite-core-0.6.18.tgz --access public
npm publish artifacts/npm/yangyu666-trellis-lite-0.6.18.tgz --access public
```

Inspect `artifacts/npm/release.json` and the packed files first. Publish core before CLI; existing package versions cannot be overwritten. npm requires account 2FA or a granular publish token with Bypass 2FA enabled; logging in alone does not satisfy publication authentication. See [npm's publishing authentication requirements](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/). The manual **Publish Trellis Lite to npm** GitHub workflow also supports this process with a scope input and the repository's `NPM_TOKEN` secret.

## Development

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

The regression suite includes all 22 adapters, Python command rewriting, task activation with legacy manifests, and migration/customization preservation. Template `.py` files and the repository's `.trellis/scripts/` copies must remain byte-identical.

Based on upstream Trellis 0.6.17. Original authors and AGPL-3.0-only licensing are retained; see [LICENSE](LICENSE).
