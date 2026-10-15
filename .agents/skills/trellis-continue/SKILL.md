---
name: trellis-continue
description: "Resume work on the current task. Loads the workflow Phase Index, figures out which phase/step to pick up at, then pulls the step-level detail via get_context.py --mode phase. Use when coming back to an in-progress task and you need to know what to do next."
---

# Continue Current Task

```bash
python3 ./.trellis/scripts/get_context.py
python3 ./.trellis/scripts/get_context.py --mode phase
```

Read the active task's `prd.md`, any supporting task documents, and relevant specs.

- `planning`: use `trellis-brainstorm` to resolve requirements and update the PRD. When implementation is authorized, run `task.py start <task>`.
- `in_progress`: continue implementing directly in this session. Choose appropriate validation tools and record scope/progress changes.
- Completed work: capture reusable knowledge when useful, then use `finish-work` (Trellis command).

Reuse prior authorizations. If there is no session-bound active task, locate the intended task from the conversation or task list and activate it explicitly. Use `get_context.py --mode phase --step <X.Y> --platform codex` for step detail.
