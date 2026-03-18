---
title: Local AI Knowledge Enricher (Ollama + Obsidian)
date: 2026-03-15
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
  Watcher            watchdog, non-recursive, skips non-whisper files
        │
  Enricher           Ollama → title, summary, tags, action_items
        │
  Writer      ──►    Obsidian REST API :27124
              └─►    Direct file write → OUTPUT_PATH  (fallback)
```

## Key Engineering Decisions

### 1. Graceful Degradation (Zero Data Loss)
Local infrastructure is inherently volatile. Models take time to load, and services restart. If the pipeline cannot reach the Ollama endpoint, it does not crash or drop the event. Instead, it falls back to writing the note *without* enrichment (using the filename as the title). 
Similarly, if the Obsidian REST API is unavailable, the `Writer` component catches the exception and falls back to a direct filesystem write. The data always reaches the vault.

### 2. Solving the Docker `root:root` Volume Footgun
A classic issue with Dockerized file-processing apps is that output files are created as `root:root` inside mounted volumes, making them unreadable by the host user (and tools like Obsidian).
To solve this for NAS/headless deployments, the pipeline explicitly requires `CURRENT_UID` and `CURRENT_GID` in the `.env` file, passing them to the container to ensure correct host-level permissions.

### 3. PKM Agnosticism (No Vendor Lock-in)
While optimized for Obsidian, the output is pure `.md` with YAML frontmatter. By decoupling the processing logic from the knowledge management tool, the enricher works seamlessly with Logseq, Foam, Dendron, or any plain-text system. 

### 4. Hardware Efficiency
This pipeline proves you don't need a massive GPU rig for local AI. Developed on an HP EliteBook 845 G8 running Ubuntu 24.04, it uses `mistral` by default, but is optimized to run on as little as 4GB total system RAM using `gemma3:1b`.

## Deployment
Supported via `systemd` (Linux), `launchd` (macOS), or `docker-compose` for NAS setups. Everything is orchestrated through a standard `Makefile` for a reproducible "one-command" setup.

## Related
- [[Building Simple Retry Queues for Local AI Pipelines]]
- [[Deployed Is Not the Same as Running the New Code]]