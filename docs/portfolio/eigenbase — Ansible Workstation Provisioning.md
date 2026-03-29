---
title: eigenbase — Ansible Workstation Provisioning
date: 2026-03-29
topic: devops
status: active
level: intermediate
tags:
  - ansible
  - iac
  - linux
  - automation
  - self-hosted
---
eigenbase is the provisioning layer of the Eigenstack —
a self-hosted, privacy-first infrastructure stack built in Germany.
It configures a full DevOps workstation in under 5 minutes
from a clean Ubuntu 24.04 install. One command. No manual steps.

**Repository:** [github.com/serg-markovich/eigenbase](https://github.com/serg-markovich/eigenbase)

---

## Problem

Every time I set up a new machine, I spent hours reinstalling tools,
hunting down configs, and debugging things that worked last time.
Nothing was recorded. Nothing was reproducible.
A single `mv ~/projects ~/work` could silently break three services.

The real problem wasn't missing tools — it was missing declarations.

---

## Solution

A declarative Ansible playbook where the state of the machine
lives in git, not in memory. Running it on a fresh machine
or an existing one produces the same result.
If CI passes, the playbook is correct. Not "probably correct" —
verifiably correct on a clean environment.

---

## Stack

| Tool | Role |
|---|---|
| Ansible | Provisioning engine |
| ansible-lint | Idempotency and code quality enforcement |
| GitHub Actions | CI — lint + syntax-check on every push |
| community.general | UFW firewall, extended OS modules |
| Helm via `get_url` | Kubernetes package manager — no curl piping |
| Kind | Local Kubernetes cluster for dev |

---

## Architecture

```
eigenbase/
├── roles/
│ ├── base/ ← packages, locale, timezone
│ ├── docker/ ← Docker CE + Compose
│ ├── kubernetes/ ← kubectl, Helm, k9s
│ ├── monitoring/ ← node_exporter
│ ├── ollama/ ← local LLM runtime
│ ├── security/ ← UFW, SSH hardening
│ └── eigenstack_dev/ ← Kind cluster for local dev
├── site.yml
├── requirements.yml ← explicit collection dependencies
└── Makefile ← install, lint, syntax, run
```

---

## What I built and why it matters

**Replaced `curl | bash` with `get_url` + `unarchive`**

Most Helm and Ollama install guides use `curl | bash`.
It works once. It's not idempotent, not auditable,
and Ansible can't track what it did.
Switching to `get_url` + `unarchive` means Ansible owns
the binary lifecycle — install, update, verify.

**Declared collection dependencies explicitly**

`community.general.ufw` worked on my machine.
CI had never heard of it. Adding `requirements.yml`
and installing collections before lint runs
removed the last implicit dependency on my local environment.

**Set up CI before expanding roles**

Lint and syntax-check went in at v0.1.0,
before the role count grew. It caught two real bugs
during the same session: a misplaced `mode` parameter
and a missing collection. Both silent in local runs.
Both caught immediately on a clean CI runner.

---

## Honest limitations

- Currently single-host — `inventory/localhost.yml` only
- No secrets management yet — `.env` in `.gitignore`,
  Ansible Vault or SOPS planned for next iteration
- Molecule tests scaffolded but not written

---

> eigenbase is part of a larger project:
> [[Eigenstack — Sovereign Self-Hosted Cloud (Germany)]]
> This role provisions the machine. The next layer runs services on it.

---

## Related

- [[Ansible Collections Must Be Declared for CI]]
- [[Portable systemd+Docker Installations via Template Substitution]]
- [[Obsidian Public Knowledge Base]]
