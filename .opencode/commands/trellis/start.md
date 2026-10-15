# Start Session

Load project context and resume the shared Trellis Lite workflow.

```bash
python3 ./.trellis/scripts/get_context.py
python3 ./.trellis/scripts/get_context.py --mode phase --platform opencode
python3 ./.trellis/scripts/get_context.py --mode packages
```

If an update hint is printed, preserve its command when reporting it. Read relevant spec indexes and recent journals as needed.

- Planning: use `trellis-brainstorm` to discuss requirements and update the PRD.
- In progress: read the PRD, supporting task documents, and relevant specs; continue implementation directly in this session.
- No task: handle questions/contained edits directly; create a task for substantial work.
- Completed: use /trellis:finish-work to archive and record the outcome.

Respect prior decisions and authorizations. When switching tools, activate the same task with `task.py start <task>` and read its persisted progress before continuing.
