---
title: Three Patterns for Reliable systemd File Watchers
date: 2026-02-26
type: guide
topic: devops
status: published
level: intermediate
tags:
  - til
  - linux
  - systemd
  - bash
  - inotify
---

# Three Patterns for Reliable systemd File Watchers

## Summary

While building a local voice transcription pipeline triggered by file system events, I ran into three non-obvious problems with `inotifywait` under systemd. Each has a clean, standard solution.

---

## 1. `create` vs `close_write`

The instinctive event to watch for new files is `-e create`. It fires the moment the filesystem entry is created — before the writing application has finished.

**The problem:** transcribing a file that is still being written produces garbage output or an error.

**The fix:** use `-e close_write` instead. It fires only after the file descriptor is closed by the writing process — guaranteeing the file is complete before any processing begins.

```bash
# Wrong: fires on file creation, before write is complete
inotifywait -m -e create -r "$WATCH_PATH"

# Correct: fires only after the writing process closes the file
inotifywait -m -e close_write -r "$WATCH_PATH"
```


## 2. `KillMode=process` leaves orphan children

A systemd service running a Bash watcher script spawns child processes — in this case, `inotifywait`. With the default `KillMode=process`, systemd only kills the direct process (bash), leaving `inotifywait` running as an orphan.

On the next `systemctl restart`, the log shows:

text

`Found left-over process (inotifywait) in control group while starting unit. This usually indicates unclean termination of a previous run.`

**The fix:** `KillMode=control-group` tells systemd to kill the entire cgroup — the parent process and all its children.

text

`[Service] KillMode=control-group KillSignal=SIGTERM TimeoutStopSec=10s`

---

## 3. Parallel processing of the same file

If two events arrive for the same file in quick succession (which can happen with some sync clients), two instances of the processing script will start concurrently, causing conflicts.

**The fix:** a `flock` lockfile scoped to the filename. If the lock is already held, the second instance skips immediately instead of queuing.

bash

`LOCK="/tmp/whisper-$(echo "$file" | md5sum | cut -c1-8).lock" exec 9>"$LOCK" flock -n 9 || { echo "Already processing: $file"; continue; } # ... process file ... flock -u 9`

The lock filename is derived from an md5 hash of the file path — unique per file, collision-resistant, no cleanup needed.

---

## Related
- [[Local Voice Transcription Pipeline]]