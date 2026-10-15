# Trellis Lite Workflow Contract

This personal fork uses the Lite contract in place of upstream role dispatch and review gates. Read this before changing workflow templates, task activation, platform context integration, or migrations.

## Main-session behavior

- Discuss requirements and persist the agreed goal, scope, constraints, and acceptance criteria in `prd.md`.
- The main session researches and implements directly, choosing validation tools appropriate to the change.
- `design.md`, `implement.md`, and `research/` are optional supporting material.
- Keep all 22 adapters and their native command/skill/hook/extension formats. Kiro's `trellis` profile is a main entry, not a dedicated worker.
- Ship no Research / Implement / Check profiles, dedicated check skill, role-context hook, or default Channel role cards.
- New tasks contain task metadata and a PRD. Role JSONL files are not generated and cannot block activation. Keep legacy manifest utilities for existing user data and explicitly requested Channel operations.
- Preserve task/session isolation, specs, journals, parent/child links, and persisted progress across tools.

## Context integrations

Shared session/workflow hooks provide main-session orientation and state hints. Pi and Oh My Pi load task artifacts directly with configurable byte limits. OpenCode's shell-session plugin carries the session identity into shell commands without rewriting agent prompts. Retain shell identity transport when removing other hooks.

## Upgrade ownership

`0.6.18.json` retires only files whose LF-normalized hashes match known original templates (both Python command renderings). Customized files remain user-owned. `update.skip` and protected task/spec/workspace paths remain authoritative.

`retireLiteConfig` removes exact retired registrations from recognized JSON hook configs and the known shipped Codex depth override. It preserves unrelated hooks, settings, and custom depth values. Apply through the normal update backup/dry-run pipeline. When preserving a customized config, record the current template's hash, never the customized bytes: otherwise a later update would mistake user settings for a pristine template and overwrite them.

The CLI is built from this fork. `upgrade` prints source-checkout instructions and does not install the upstream npm package. No npm publication is part of this fork change.

## Verification

Use the CLI integration tests for all 22 platforms, configure/collect parity under both Python renderings, PRD-only task activation with legacy empty manifests, real extension event tests, and repeat-update/dry-run preservation tests. Template Python files and dogfood script copies must remain byte-identical. Remove tests of retired behavior and replace them with Lite behavior tests; keep regressions for surviving capabilities.
