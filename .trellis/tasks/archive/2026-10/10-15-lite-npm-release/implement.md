# npm release verification

- npm identity: `yangyu666`; both requested scoped names were available before publication.
- Packed CLI/core retain source compatibility, ship sources and AGPL license, and omit workspace scripts, dev dependencies, and private flags.
- Clean temporary installation passed using a local core override before publication. The installed CLI reported 0.6.18 and its own Lite upgrade command.
- Installed tarball initialized Claude Code, Codex, and Cursor together, preserving PRD discussion and omitting dedicated role agents.
- ESM and bundler type resolution passed `@arethetypeswrong/cli` 0.18.5 with its `esm-only` profile, matching the existing ESM distribution.
- `publint` 0.3.21 passed core inspection. CLI inspection reported 12 module-format findings exclusively in the copied OpenCode template assets under `dist/templates/` and `src/templates/`. Those files are read and installed as assets, not executed as CLI modules; CLI execution and initialization passed. No runtime entrypoint findings occurred. The nested OpenCode template package manifest is preserved as-is.
- Upgrade tests: four passed. Workspace lint, TypeScript checks, and build passed.

## Published result

Published `@yangyu666/trellis-lite-core@0.6.18` first, then `@yangyu666/trellis-lite@0.6.18`, on 2026-10-15 with public access and the `latest` tag. The user completed npm's browser authentication for each package. Both versions became publicly downloadable after npm's publish-time scanning delay.

Public registry versions and SHA-512 integrity match the prepared tarballs; the CLI's dependency pins the published Lite core through the npm alias. The exact manifest is saved in `release.json`.

Installed `@yangyu666/trellis-lite` from the public registry into a clean global prefix without overrides. `trellis --version` returned 0.6.18, the core resolved to `@yangyu666/trellis-lite-core@0.6.18`, and combined Claude/Codex/Cursor initialization passed. The npm upgrade hint uses the correct scoped Lite name.

Added a public-registry verifier to the release workflow. It waits for version availability and the intended dist-tag, checks integrity and the core alias, retries scanning-related 404s, and fails on mismatched artifacts. Seven targeted tests passed, including three integration cases for scanning delay, integrity mismatch, and a placeholder `latest` tag. Workspace lint passed after these changes. Build and TypeScript checking passed for the published CLI changes.

The packed runtime/source code corresponds to commit `bff56d2`; later changes add release verification automation and records.
