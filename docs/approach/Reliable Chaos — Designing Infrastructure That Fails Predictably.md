---
title: "Reliable Chaos — Designing Infrastructure That Fails Predictably"
description: "A design mindset: resilience comes not from preventing failure, but from making it observable, bounded, and recoverable."
date: 2026-03-10
type: approach
topic: devops
status: draft
level: intermediate
tags:
  - sre
  - chaos-engineering
  - observability
  - approach
---

> Resilience is not about preventing failure.  
> It's about making failure observable, bounded, and recoverable.

## The Problem with "Don't Break Things"

"Don't break things" is not an engineering constraint — it's a wish.
Everything breaks. The question is: when it does, can you see it, contain it, and recover from it?

This is the SRE insight applied at the architectural level.
I call the resulting design mindset **Reliable Chaos** — the system is internally
flexible and adaptive, but externally predictable and stable.

---

## Three Design Questions

Before shipping any infrastructure component, I ask:

1. **What does "working" look like?** — Define the SLO before building. If you can't measure it, you can't know it's broken.
2. **What happens when this goes down?** — Design the failure path explicitly. Timeouts, circuit breakers, fallbacks.
3. **Have I actually broken it?** — Test the failure. Kill the service. Watch what happens.

---

## In Practice

This is a work-in-progress note. Concrete examples will be added as I document failure scenarios from:

- `local-whisper-obsidian` — what happens when inotifywait dies silently
- `openwebui-systemd-stack` — Ollama OOM behavior under load
- `eigenstack` — backup verification and restore testing

→ [[IaC = DRY + TRIZ - How I Approach Infrastructure Problems]]

---

## Further Reading

- [Google SRE Book](https://sre.google/books/) — the source of the SLO-first mindset

