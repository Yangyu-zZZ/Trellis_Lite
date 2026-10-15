# Implementation Plan

- Inspect platform generation, task lifecycle, extension runtimes, and migration ownership.
- Run GitNexus impact analysis before editing existing symbols.
- Replace shared workflow/instructions with PRD planning followed by main-session execution.
- Remove dedicated role templates, check skill, and role injection wiring on every platform.
- Remove automatic JSONL creation and activation gates; maintain dogfood parity.
- Add safe retirement migration and update documentation/references.
- Update affected tests and add all-platform Lite integration coverage.
- Run targeted/full relevant tests, lint, typecheck, and build.
- Review change impact, commit, and push the authorized result.

## Validation

Use pnpm 10.32.1 and the committed lockfile. Cover every registered platform, legacy-task activation, safe migration preservation, and workflow rendering. Keep tests for surviving platform facilities. Record environment limitations accurately.

## Results

- CLI: 1645 tests passed, 34 skipped, zero failures across 369 suites (Windows, four workers).
- Core: 398 tests passed, two skipped across 21 files.
- Workspace build, TypeScript checking, and ESLint passed. Python type checking passed with zero errors and 68 existing warnings.
- All 22 adapters have initialization and Lite workflow coverage, including both Python command renderings and legacy empty-manifest task activation.
- Actual 0.6.17-to-0.6.18 updates of combined 22-platform fixtures passed for both `python` and `python3`: 84 pristine retired files removed, personal tasks/specs/journals preserved, and repeat updates did not restore retired files.
- Customized config preservation, repeated update, and dry-run behavior passed integration tests.
- The 28 Python script templates are byte-identical to the repository's `.trellis/scripts/` copies. Root platform instructions/extensions are synchronized.
- Verification covers generated configuration and automated hook/extension behavior; it does not claim interactive testing inside all 22 installed coding clients.
- No npm release, lockfile changes, or submodule changes are part of this work.
