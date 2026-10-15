# npm release verification

- npm identity: `yangyu666`; both requested scoped names were available before publication.
- Packed CLI/core retain source compatibility, ship sources and AGPL license, and omit workspace scripts, dev dependencies, and private flags.
- Clean temporary installation passed using a local core override before publication. The installed CLI reported 0.6.18 and its own Lite upgrade command.
- Installed tarball initialized Claude Code, Codex, and Cursor together, preserving PRD discussion and omitting dedicated role agents.
- ESM and bundler type resolution passed `@arethetypeswrong/cli` 0.18.5 with its `esm-only` profile, matching the existing ESM distribution.
- `publint` 0.3.21 passed core inspection. CLI inspection reported 12 module-format findings exclusively in the copied OpenCode template assets under `dist/templates/` and `src/templates/`. Those files are read and installed as assets, not executed as CLI modules; CLI execution and initialization passed. No runtime entrypoint findings occurred. The nested OpenCode template package manifest is preserved as-is.
- Upgrade tests: four passed. Workspace lint, TypeScript checks, and build passed.

Final packages for `yangyu666` passed metadata inspection and `npm publish --dry-run`. The installed package's public CLI API and every core subpath also imported successfully. Publication of core returned E403: npm requires account 2FA or a granular publish token with Bypass 2FA. The user was asked to complete this account authentication; neither package has been published.

Pending: account publish authentication, public publish and registry-integrity verification, clean install without overrides, and final release records.
