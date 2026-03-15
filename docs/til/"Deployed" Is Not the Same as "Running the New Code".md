---
title: '"Deployed" Is Not the Same as "Running the New Code"'
date: 2026-03-15
type: til
topic: devops
status: published
level: intermediate
tags:
  - til
  - linux
  - systemd
  - bash
  - pipefail
---

# TIL: "Deployed" Is Not the Same as "Running the New Code"

## Summary

A systemd service was active and healthy. Audio files sat unprocessed in the
inbox. No errors in the logs. The bug was not in the code — it was in the gap
between the code on disk and the code actually running.

---

## The Problem

I added a startup scan to a file watcher: on service init, process any audio
files that arrived while the service was offline.

```bash
echo "Startup scan: checking for unprocessed files..."
for p in "${VALID[@]}"; do
    find "$p" -maxdepth 1 -type f \
        | grep -iE '\.(m4a|mp3|wav|ogg|opus|webm|flac)$' \
        | while read -r file; do
            "$PYTHON" "$SCRIPT" "$file"
        done
done
```

The service was running. The files were there. Nothing was transcribed.
`journalctl` showed a healthy start — and stopped at `Watches established.`
No startup scan output at all.

---

## Root Cause 1: The Deployed Script Was Not Updated

systemd's `ExecStart` pointed to `~/.config/local-whisper-obsidian/watch.sh`.
The new code lived in `bin/watch-linux.sh`. `make install` copies one to the
other — but it had not been run since the new code was added.

```bash
# This tells you what is actually running — not what you think is running
cat /proc/<PID>/cmdline | tr '\0' ' '
```

Output:
```
/bin/bash /home/sergey/.config/local-whisper-obsidian/watch.sh
```

The new script with startup scan had never been deployed.

**Rule:** changing `bin/` without running `make install` is not a deployment.
It is a local edit.

---

## Root Cause 2: `grep` with No Matches Kills the Pipeline

After deploying the fix, the service started — and immediately crashed with
`exit-code 1`. The startup scan ran, then `inotifywait` never launched.

The culprit: `set -euo pipefail` combined with `grep` returning exit 1
when no audio files matched in a directory:

```bash
# Broken: exit 1 from grep on empty directory kills the script
find "$p" -maxdepth 1 -type f \
    | grep -iE '\.(m4a|mp3|wav|ogg|opus|webm|flac)$' \
    | while read -r file; do
        "$PYTHON" "$SCRIPT" "$file"
    done
```

Under `pipefail`, a non-zero exit from any command in a pipe kills the script.
An empty directory is not an error — but bash treated it as one.

The fix:

```bash
# Fixed: empty result is treated as success
find "$p" -maxdepth 1 -type f \
    | { grep -iE '\.(m4a|mp3|wav|ogg|opus|webm|flac)$' || true; } \
    | while read -r file; do
        "$PYTHON" "$SCRIPT" "$file"
    done
```

`{ grep ... || true; }` wraps grep in a group. If no files match, the group
exits 0. The pipeline continues. The service stays alive.

Note: the `grep -q ... || continue` pattern inside the `inotifywait` loop is
intentionally different — there, a non-match means "skip this file", which is
correct logic, not a failure condition.

---

## Checklist

When a service is running but not doing what the new code says:

- [ ] Check `ExecStart` in the unit file — what path is actually invoked?
- [ ] Check `/proc/<PID>/cmdline` — what binary is actually running?
- [ ] Run `make install` (or equivalent deploy step) — not just `make restart`
- [ ] Under `pipefail`, wrap `grep` used as a filter with `|| true`

---

## Related

- [[Three Patterns for Reliable systemd File Watchers]]
- [[Building Simple Retry Queues for Local AI Pipelines]]
- [[Local AI Knowledge Enricher (Ollama + Obsidian)]]

