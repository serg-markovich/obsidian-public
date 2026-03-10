---
title: "IaC Is a Medium, Not a Method — DRY + TRIZ as a Thinking Framework"
description: "Two principles I apply before writing any infrastructure code: DRY to eliminate duplication, TRIZ to resolve contradictions."
date: 2026-03-10
type: approach
topic: devops
status: published
level: intermediate
tags:
  - iac
  - triz
  - dry
  - terraform
  - ansible
  - approach
---

> Most infrastructure pain comes from two sources: duplication and unresolved contradictions.  
> DRY eliminates the first. TRIZ resolves the second.

## IaC Is a Medium, Not a Method

The standard answer to infrastructure pain is "just use IaC" — Terraform, Ansible, Kubernetes manifests.
But IaC is a medium, not a method. You can write terrible, duplicated,
contradictory infrastructure code just as easily as terrible application code.

Scripts multiply. Pipelines diverge. The same secret lives in four places.
A month later, nobody knows which copy is the source of truth.

What's missing is a **thinking framework** for *what* to put in the code and *how* to structure it.
I use two: DRY and TRIZ.

---

## DRY: One Source of Truth

**Don't Repeat Yourself** is well-known in software development,
but underestimated in infrastructure.

In practice, DRY in IaC means:

- **One source of truth** for every variable, secret, and config value
- **Modules and roles** instead of copy-pasted resource blocks
- **Reusable workflows** — GitHub Actions reusable workflows, Ansible roles — instead of per-project YAML duplication
- **Parameterised manifests** — one Helm chart or Kustomize base, not three slightly-different copies for dev/staging/prod

### Example: eigenstack

In my self-hosted stack, every service shares a single `docker-compose.override.yml` pattern.
Environment variables are defined once in `.env` and referenced everywhere.
Backup logic lives in one Makefile target, not in three separate cron scripts.

When I need to add a new service, I copy one template block and fill in four variables.
No duplication, no drift.

→ [[Eigen-Stack — Sovereign Self-Hosted Cloud (Germany)]]

---

## TRIZ: Resolve Contradictions, Don't Compromise

**TRIZ** (Theory of Inventive Problem Solving) is a method for resolving
technical contradictions — situations where improving one parameter makes another worse.

Infrastructure is full of these:

| Contradiction | Naive compromise | TRIZ resolution |
|---|---|---|
| Fast deploys vs stable production | Deploy less often | Segmentation: separate pipeline per environment |
| Open API vs security | Add auth everywhere | Trimming: reduce surface, don't add guards |
| Observability vs performance | Log less | Preliminary action: async buffer + structured logs |
| Privacy vs functionality | Disable features | Dimension shift: local-first processing |

The key insight: **a compromise is not a solution**.
A real solution eliminates the contradiction at the architectural level.

### Example: local-whisper-obsidian

The contradiction: I want voice notes transcribed automatically (convenience)
but I don't want audio leaving my device (privacy).

A compromise: use a cloud API and "trust" the vendor.  
The TRIZ resolution: move the processing to the same device as the data.
Local Whisper model, triggered by `inotifywait`, writes directly to Obsidian vault.
No cloud. No compromise. Contradiction resolved.

→ [[Local Voice Transcription Pipeline]]

---

## Related

- [[Reliable Chaos — Designing Infrastructure That Fails Predictably]]
- [[Local Voice Transcription Pipeline]]

