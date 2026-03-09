---
title: IaC = DRY + TRIZ - How I Approach Infrastructure Problems
description: A practical framework for solving infrastructure problems by combining DRY principles with TRIZ inventive thinking
type: article
status: active
tags:
  - iac
  - triz
  - dry
  - terraform
  - ansible
  - systemd
  - approach
---

> Most infrastructure pain comes from two sources: duplication and unresolved contradictions.
> DRY eliminates the first. TRIZ resolves the second.

## The Problem with "Just Automate It"

Automation without a framework tends to accumulate technical debt fast.
Scripts multiply. Pipelines diverge. The same secret lives in four places.
A month later, nobody knows which copy is the source of truth.

The standard answer is "just use IaC" — Terraform, Ansible, Kubernetes manifests.
But IaC is a medium, not a method. You can write terrible, duplicated,
contradictory infrastructure code just as easily as terrible application code.

What's missing is a **thinking framework** for *what* to put in the code and *how* to structure it.

## DRY in Infrastructure

**Don't Repeat Yourself** is well-known in software development,
but its application to infrastructure is underestimated.

In practice, DRY in IaC means:

- **One source of truth** for every variable, secret, and config value
- **Modules and roles** instead of copy-pasted resource blocks
- **Templated pipelines** (GitHub Actions reusable workflows, Ansible roles)
  instead of per-project YAML duplication
- **Parameterised manifests** — one Helm chart or Kustomize base,
  not three slightly-different copies for dev/staging/prod

### Real example: eigenstack

In my self-hosted stack ([eigenstack](../portfolio/eigenstack.md)),
every service shares a single `docker-compose.override.yml` pattern.
Environment variables are defined once in `.env` and referenced everywhere.
Backup logic lives in one Makefile target, not in three separate cron scripts.

When I need to add a new service, I copy one template block and fill in four variables.
No duplication, no drift.

## TRIZ: Resolving Contradictions, Not Compromising

**TRIZ** (Theory of Inventive Problem Solving) is a systematic method
for resolving technical contradictions — situations where improving one parameter
makes another worse.

Infrastructure is full of these:

| Contradiction | Naive compromise | TRIZ resolution |
|---|---|---|
| Fast deploys vs stable production | Deploy less often | Segmentation: separate deploy pipeline per environment |
| Open API vs security | Add authentication everywhere | Trimming: remove the surface, not add guards |
| Observability vs performance | Log less | Preliminary action: async log buffer, structured logs |
| Privacy vs functionality | Disable features | Transitioning to another dimension: local-first processing |

The key insight from TRIZ: **a compromise is not a solution**.
A real solution eliminates the contradiction at the architectural level.

### Real example: local-whisper-obsidian

The contradiction: I want voice notes transcribed automatically (convenience)
but I don't want audio leaving my device (privacy).

A compromise would be: use a cloud API but "trust" the vendor.
The TRIZ resolution: move the processing to the same device as the data.
Local Whisper model, triggered by inotifywait, writes directly to Obsidian vault.
No cloud. No compromise. Contradiction resolved.

→ See: [[Local Voice Transcription Pipeline]]

## Reliable Chaos: What the Framework Produces

When DRY is applied consistently and contradictions are resolved rather than patched,
something predictable happens: the system becomes resilient not by avoiding failure,
but by making failure **observable, bounded, and recoverable**.

This is the SRE insight applied at the architectural level:
- Define SLOs before you build (what does "working" look like?)
- Design for failure (what happens when this service goes down?)
- Test the failure (chaos engineering: actually kill it and watch)

I call this **Reliable Chaos** — the system is internally flexible and adaptive,
but externally predictable and stable.

## In Practice: The Three Pillars

This framework is the foundation of my three main infrastructure projects:

| Project | DRY application | TRIZ contradiction resolved |
|---|---|---|
| [eigenstack](../portfolio/eigenstack.md) | Single compose template, one `.env` | Privacy vs convenience → local-first |
| [azure-de-stack](../portfolio/azure-de-stack.md) | Reusable Bicep/Terraform modules | Cost vs reliability → reserved instances + autoscale |
| [ukraine-transparency](../portfolio/ukraine-transparency.md) | Shared schema, one audit log pattern | Openness vs integrity → append-only log |

## Further Reading

- [TRIZ for Software Engineering](https://www.dioneo.net/triz-for-software/) — practical mapping of TRIZ principles to software components
- Google SRE Book — [sre.google/books](https://sre.google/books/)
- [Chaos Engineering (Thoughtworks)](https://www.thoughtworks.com/insights/blog/agile-engineering-practices/building-resiliency-chaos-engineering)
