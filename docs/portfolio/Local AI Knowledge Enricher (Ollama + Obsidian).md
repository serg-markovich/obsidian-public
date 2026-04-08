---
title: Local AI Knowledge Enricher (Ollama + Obsidian)
date: 2026-04-08
version: v0.4.0
type: portfolio
topic: devops
status: published
level: advanced
tags:
  - python
  - systemd
  - docker
  - local-ai
  - architecture
  - eigenstack
---

`whisper-ollama-enricher` is the second stage of my fully local, privacy-first voice-to-knowledge pipeline. It watches a folder for raw voice transcripts, enriches them via a local Ollama LLM (extracting titles, summaries, tags, and action items), and writes structured Markdown notes.

No cloud. No API keys. Runs entirely on CPU.

**Links:**
- GitHub: [serg-markovich/whisper-ollama-enricher](https://github.com/serg-markovich/whisper-ollama-enricher)
- Stage 1: [[Local Voice Transcription Pipeline]]
- Architecture overview: [[eigenstack]]

## The Architecture

The pipeline is designed using a strict **Pipes and Filters** pattern to ensure each component does only one thing.

```text
vault/0_inbox/*.md   ← JSON transcript from local-whisper-obsidian
        │
  Watcher            watchdog, non-recursive, startup scan on init
        │
  Enricher           Ollama → title, summary, tags, action_items
        │             ↓ OllamaUnavailableError
        │           .retry/  →  reprocess every RETRY_INTERVAL sec
        │           .failed/  ←  after RETRY_MAX_ATTEMPTS
        │
  Writer      ──►    Obsidian REST API :27124  (optional)
              └─►    Direct file write → OUTPUT_PATH  (default)
```

## Key Engineering Decisions

### 1. Antifragile Retry Queue (Zero Data Loss)

Local infrastructure is inherently volatile — models take time to load, services restart. If Ollama is unreachable, the pipeline does not crash or drop the file. Instead, it moves it to a `.retry/` queue and reprocesses automatically every 30 seconds (configurable via `RETRY_INTERVAL`). After `RETRY_MAX_ATTEMPTS` failed attempts, the file moves to `.failed/` with an error log — never silently lost.

The Obsidian REST API fallback remains: if the API key is empty or the call fails, the Writer falls back to a direct filesystem write. The data always reaches the vault.

### 2. Startup Scan — Deployed ≠ Running the New Code

A subtle production failure: files that arrive in the inbox while the service is offline are invisible to watchdog — it only sees new events, not existing files. On every service start, the watcher now scans `INBOX_PATH` and `.retry/` for pending files before entering the watch loop.

Lesson learned: [[Deployed Is Not the Same as Running the New Code]]

### 3. Retry Counter Stored by Filename, Not by Path

The retry attempt counter is stored as a sidecar file in `.retry/` keyed by filename — not by the full file path. This means the counter survives the file moving between `.retry/` and `INBOX_PATH` during reprocessing, preventing a reset-to-zero bug that would allow infinite retries.

### 4. Solving the Docker `root:root` Volume Footgun

A classic issue with Dockerized file-processing apps is that output files are created as `root:root` inside mounted volumes, making them unreadable by the host user (and tools like Obsidian). To solve this for NAS/headless deployments, the pipeline explicitly requires `CURRENT_UID` and `CURRENT_GID` in the `.env` file, passing them to the container to ensure correct host-level permissions.

### 5. PKM Agnosticism (No Vendor Lock-in)

While optimized for Obsidian, the output is pure `.md` with YAML frontmatter. By decoupling the processing logic from the knowledge management tool, the enricher works seamlessly with Logseq, Foam, Dendron, or any plain-text system.

### 6. Hardware Efficiency

This pipeline proves you don't need a massive GPU rig for local AI. Developed on an HP EliteBook 845 G8 running Ubuntu 24.04, it uses `mistral` by default, but is optimized to run on as little as 4 GB total system RAM using `gemma3:1b`.

## Deployment

Supported via `systemd` (Linux), `launchd` (macOS), or `docker-compose` for NAS setups. Everything is orchestrated through a standard `Makefile` for a reproducible one-command setup:

```bash
make install   # venv + systemd/launchd
make start     # start service
make logs      # live logs
make test      # 21 tests
```

## Related

- [[Building Simple Retry Queues for Local AI Pipelines]]
- [[Deployed Is Not the Same as Running the New Code]]
