# npm release verification

- npm identity: `yangyu666`; both requested scoped names were available before publication.
- Packed CLI/core retain source compatibility, ship sources and AGPL license, and omit workspace scripts, dev dependencies, and private flags.
- Clean temporary installation passed using a local core override before publication. The installed CLI reported 0.6.18 and its own Lite upgrade command.
- Installed tarball initialized Claude Code, Codex, and Cursor together, preserving PRD discussion and omitting dedicated role agents.
- ESM and bundler type resolution passed `@arethetypeswrong/cli` 0.18.5 with its `esm-only` profile, matching the existing ESM distribution.
- `publint` 0.3.21 passed core inspection. CLI inspection reported 12 module-format findings exclusively in the copied OpenCode template assets under `dist/templates/` and `src/templates/`. Those files are read and installed as assets, not executed as CLI modules; CLI execution and initialization passed. No runtime entrypoint findings occurred. The nested OpenCode template package manifest is preserved as-is.
- Upgrade tests: four passed. Workspace lint, TypeScript checks, and build passed.

Pending: final package preparation for the authenticated scope, public publish and registry-integrity verification, clean install without overrides, and commit/upload of final release records.
