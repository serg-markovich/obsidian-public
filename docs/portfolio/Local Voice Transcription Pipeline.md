---
title: Local Voice Transcription Pipeline
date: 2026-02-26
topic: devops
status: published
level: intermediate
tags:
  - python
  - systemd
  - whisper
  - obsidian
  - self-hosted
  - homelab
  - docker
  - macos
---

# Project: local-whisper-obsidian

A fully local voice-to-Obsidian transcription pipeline. No cloud, no API keys, no subscriptions. Voice memos recorded on mobile sync via Syncthing and are automatically transcribed into structured Markdown notes using Faster Whisper running on CPU.

**Links:**

- **Source Code:** [serg-markovich/local-whisper-obsidian](https://github.com/serg-markovich/local-whisper-obsidian)

---

## The Problem

Obsidian mobile can record voice memos, but does not transcribe them. Cloud transcription services (Whisper API, Otter.ai) require sending private audio to external servers. The goal was a fully offline pipeline that triggers automatically without any manual steps.

---

## Architecture
```text
Voice memo (.m4a / .mp3 / .wav)
|
inotifywait <-- watches configured vault paths via close_write
|
faster-whisper (CPU, int8 quantized)
|
Markdown note with YAML frontmatter + wikilink to audio
|
Obsidian inbox
```

The pipeline is split into two components with a single responsibility each:

- `bin/watch-linux.sh` — filesystem watcher only, no processing logic
- `src/transcribe.py` — transcription and note generation only, no filesystem logic

---

## Key Engineering Decisions

**`close_write` instead of `create`**
Ensures the audio file is fully written before transcription starts. Eliminates race conditions with Syncthing and Obsidian mobile.

**`flock` lockfile per file**
Prevents parallel transcription of the same file if two filesystem events arrive in quick succession.
...
macOS: `flock` not available — `fswatch` processes events sequentially by default.

**`KillMode=control-group` in systemd**
Ensures clean shutdown — kills both the bash watcher and the child `inotifywait` process as a unit.

**Lazy model loading via `class Transcriber`**
The Whisper model is initialized once and reused across transcriptions. Avoids 3–10 second cold start per file.

**XDG-compliant config**
User config lives in `~/.config/local-whisper-obsidian/.env`, separate from source code. Personal paths never touch the repository.

---

## Stack

`faster-whisper` · `Python 3.11` · `systemd` · `inotify-tools` · `fswatch` · `pytest` · `ruff` · `GitHub Actions CI`

---

## Update: Docker / NAS Support (2026-03-02)

Added a parallel execution path for homelab and NAS setups (Unraid, Synology).

**What changed:**
- `bin/watch-docker.sh` — new container entrypoint (env vars, no .env file)
- `docker/Dockerfile` — `python:3.11-slim` + `inotify-tools`
- `docker/docker-compose.yml` — vault volume + model cache volume
- `Makefile` — `docker-build`, `docker-up`, `docker-down`, `docker-logs`

**Architecture decision:** kept the existing systemd path completely untouched.
Docker is a third entrypoint alongside `watch-linux.sh` and `watch-macos.sh`,
not a replacement.

**Trigger:** a comment on r/ObsidianMD asking for Unraid support. Shipped in
one day after the request.

---

## Update: macOS Reliability & Docker Ownership Fix (2026-03-03)

### macOS watcher hardening
Three issues discovered during real-world usage on macOS:

- **`wait_for_stable`** — replaced fixed `sleep` with polling loop that checks
  file size until it stops changing. Fixes truncated transcriptions on slow sync.
- **Deduplication** — `fswatch` can fire multiple events for the same file.
  Added in-memory guard to skip already-processing files.
- **Full Disk Access check** — added explicit check at startup with actionable
  error message instead of a silent permission failure.

### Docker volume ownership
Files written by the container were created as `root:root` on the host —
a common Docker footgun. Fixed via `CURRENT_UID` / `CURRENT_GID` passed
through `docker/.env`. Model cache relocated from `/root/.cache` to
`/cache/huggingface` so the non-root user can read it.

**Makefile** now branches by OS for all systemd commands —
macOS falls back to `nohup` + PID file.

---

## My Setup

- Model: `medium` — better accuracy for multilingual notes
- Sync: Syncthing (Android → Linux)
- Vault: `0_inbox` for new voice notes, `7_system/files` for Obsidian mobile recordings

---

## Related Notes
- [[Three Patterns for Reliable systemd File Watchers]]
- [[Docker entrypoint as a drop-in for systemd services]]
- [[Docker Volumes and File Ownership — Why Your Files Belong to Root]]
