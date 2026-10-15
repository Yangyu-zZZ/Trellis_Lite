# Trellis Lite: Main-session Development

## Goal

Preserve project knowledge and requirements planning while letting the current coding assistant execute work directly.

## Requirements

- Retain all 22 platform adapters, requirements discussion, PRD creation/update, specs, task lifecycle, developer journals, and cross-tool continuity.
- Remove dedicated Research, Implement, and Check profiles and automatic dispatch.
- Remove the check skill, mandatory review stage, and check/self-fix loop. The assistant remains free to run project validation tools when useful.
- Remove automatic role-context manifest creation and task-start gates.
- Update generated platform files, repository configuration, documentation, and affected tests consistently.
- Safely retire unmodified managed files during upgrades; preserve modified user files and existing task data.
- Commit and push to Yangyu-zZZ/Trellis_Lite, as explicitly authorized after the scope discussion.

## Acceptance Criteria

- [x] All 22 platforms initialize with their native command/skill and session-context facilities.
- [x] No generated platform installs dedicated Research/Implement/Check profiles, the check skill, or role-context injection wiring.
- [x] The workflow plans into a PRD and then executes in the main session without a mandatory check/self-fix stage.
- [x] Tasks create/start without role JSONL manifests, including when legacy empty manifests exist.
- [x] Specs, tasks, PRDs, and journals remain usable across tools.
- [x] Migration removes unmodified retired files and preserves customizations and task data.
- [x] Relevant tests, lint, typecheck, and build pass; limitations are documented accurately.

## Out of Scope

- Removing ordinary project tests, memory search, task metadata, or the explicitly invoked Channel collaboration CLI.
- Publishing an npm release or changing upstream submodules.

## Authorization

The user approved the scope after discussing PRD retention and full platform compatibility, then authorized implementation and upload. No further planning approval is needed.
