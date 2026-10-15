# Publish Trellis Lite to npm

## Goal

Make the Lite fork installable through npm under the user's own package scope, with the existing `trellis` command and all 22 platform adapters.

## Acceptance Criteria

- [ ] Prepare CLI and core tarballs with matching versions, independent public names, source and license files.
- [ ] Pin the CLI to the Lite core rather than fetching the official core package.
- [ ] Preserve source workspace imports and prevent direct publication under official package names.
- [ ] Verify package metadata, exports/types, and clean-prefix CLI installation and initialization.
- [ ] Publish core before CLI after the user logs into npm; verify public registry visibility and installation.
- [ ] Update installation, upgrade, and release documentation and push the authorized changes.

## Authorization and dependencies

The user's current request authorizes npm publication and supersedes the earlier source-only scope. The user supplied `yangyu666`, confirmed by `npm whoami`. Package names are `@yangyu666/trellis-lite` and `@yangyu666/trellis-lite-core`; neither is occupied. Do not publish under `@mindfoldhq`.

