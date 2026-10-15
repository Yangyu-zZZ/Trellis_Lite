# Design

Use one shared main-session workflow for every platform. Retain native command/skill delivery, session identity propagation, and startup/workflow-state hooks.

Remove dedicated role templates and injection wiring. Keep Kiro's main `trellis` profile because it supplies main-session hooks. Keep Pi/OMP context integration while removing role execution.

Task creation no longer seeds role JSONL; activation no longer requires it. Legacy utilities can still handle historical manifests, but these are outside the Lite development contract.

Keep template/dogfood Python copies identical. Update shared instructions and bundled references. Retire managed files through the existing hash-ownership migration mechanism, preserving user changes and task data.

Channel remains an independent, explicitly invoked capability. Custom remote workflows are user-selected overrides.
