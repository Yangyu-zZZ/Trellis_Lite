# Finish Work

Record the outcome of the current session and archive completed work.

## Load current state

```bash
{{PYTHON_CMD}} ./.trellis/scripts/get_context.py --mode record
```

Read the active task's PRD and summarize what was completed, what was verified, and any remaining issues. Use project tests or other tools when appropriate to the work.

## Save the handoff

If incomplete, update task progress/next steps and leave the task active. If complete, archive the task:

```bash
{{PYTHON_CMD}} ./.trellis/scripts/task.py archive <task-name>
```

Archive validates task metadata and branch bookkeeping; address any specific script error rather than discarding task data. Other tasks are archived only when the user requests their cleanup.

Record the session:

```bash
{{PYTHON_CMD}} ./.trellis/scripts/add_session.py --title "Session title" --summary "Outcome, decisions, and next steps"
```

Include `--commit "hash1,hash2"` when work commits exist. Follow the user's instructions for committing/uploading work. The scripts honor `session_auto_commit` in `.trellis/config.yaml` for their own journal/archive changes.

Capture reusable knowledge with `trellis-update-spec` when useful. A partial session can be recorded without declaring the task complete.
