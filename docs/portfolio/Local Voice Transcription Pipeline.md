---
title: Local Voice Transcription Pipeline
date: 2026-02-26
type: project
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

**`KillMode=control-group` in systemd**
Ensures clean shutdown — kills both the bash watcher and the child `inotifywait` process as a unit.

**Lazy model loading via `class Transcriber`**
The Whisper model is initialized once and reused across transcriptions. Avoids 3–10 second cold start per file.

**XDG-compliant config**
User config lives in `~/.config/local-whisper-obsidian/.env`, separate from source code. Personal paths never touch the repository.

---

## Stack

`faster-whisper` · `Python 3.11` · `systemd` · `inotify-tools` · `pytest` · `ruff` · `GitHub Actions CI`

---

## My Setup

- Model: `medium` — better accuracy for multilingual notes
- Sync: Syncthing (Android → Linux)
- Vault: `0_inbox` for new voice notes, `7_system/files` for Obsidian mobile recordings

---

## Related Notes
- [[Three Patterns for Reliable systemd File Watchers]]