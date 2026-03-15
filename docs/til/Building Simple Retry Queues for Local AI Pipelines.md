---
title: Building Simple Retry Queues for Local AI Pipelines
date: 2026-03-15
type: til
topic: devops
status: published
level: intermediate
tags:
  - python
  - architecture
  - triz
  - ollama
---

When building `whisper-ollama-enricher` (the second stage of my local voice-to-knowledge pipeline), I ran into a classic infrastructure contradiction. 

The problem: My Python watchdog script sends raw transcripts to a local Ollama API for enrichment. But homelab services go down, and models take time to load. If the API is unreachable, the event is lost. 

The standard solution adds a message broker like RabbitMQ — now you've traded one problem for three: deployment, ops overhead, and a new failure point. The TRIZ resolution is to eliminate the contradiction: keep the system simple but make the filesystem itself act as the queue.

Instead of complex message passing, I implemented a lightweight file-based retry mechanism:
1. If Ollama throws a `ConnectError`, the script catches a custom `OllamaUnavailableError` and moves the `.md` file to a `.retry` directory.
2. A background daemon thread wakes up every 30 seconds (`RETRY_INTERVAL`).
3. It checks the `.retry` folder and moves files back to the inbox for reprocessing.

This keeps the architecture purely event-driven and strictly aligned with the Unix philosophy. No database, no heavy message brokers, and zero data loss during reboots. 

**Related Notes:**
- [[Local Voice Transcription Pipeline]]
- [[IaC = DRY + TRIZ - How I Approach Infrastructure Problems]]
- [[Local AI Knowledge Enricher]]

