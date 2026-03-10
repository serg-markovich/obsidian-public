---
title: Monitoring & Observability
description: How I monitor eigenstack — Prometheus, Netdata, Alertmanager. SLOs, alerting to Telegram, and what's still missing.
date: 2026-03-10
type: note
topic: devops
status: seedling
level: intermediate
tags:
  - monitoring
  - prometheus
  - grafana
  - netdata
  - alertmanager
  - sre
  - devops
---

> 🌱 Seedling — SLOs and alerting stack documented. Loki and Grafana dashboards as code still TODO.

## The Problem I Was Solving

A self-hosted stack with no monitoring is a black box.
You find out something is broken when a service stops responding —
not when it starts degrading.

I wanted to know about problems before users do (even if the only "user" is me).

---

## Stack

Netdata → realtime metrics, live web UI, zero config
Prometheus → persistent metrics, 30-day retention, PromQL
node-exporter → host-level metrics scraped by Prometheus
Alertmanager → routes Prometheus alerts → Telegram

text

**Why both Netdata and Prometheus?**

TRIZ contradiction: *realtime visibility* vs *persistent history*.

Netdata is great for "what is happening right now" — auto-discovers Docker
containers, shows per-container CPU/RAM without any configuration.
But it keeps only ~1 hour of history.

Prometheus solves the retention problem and handles alerting rules.
They don't overlap — both stay.

---

## SLOs for eigenstack

Defined before setting up alerts, not after.

| Metric | Target | Alert |
|---|---|---|
| Uptime | 99.5% | Down > 5 min → CRITICAL |
| Response time | < 500ms p95 | — (tracked, not alerted) |
| Disk usage | < 80% | > 80% WARNING, > 90% CRITICAL |
| Memory usage | < 75% | > 85% WARNING |
| Backup success | 100% daily | Any failure → CRITICAL |
| SSL expiry | > 7 days | < 7 days → CRITICAL |

---

## Alerting

Alertmanager routes everything to **Telegram**.
One bot, one chat, immediate mobile notification.

Rules live in `prometheus/alerts.yml` — stored in git alongside the rest
of eigenstack config. Changing an alert threshold is a commit, not a
click in a UI.

---

## What's Still Missing

- **Loki** — no log aggregation yet. Currently: `docker logs` + grep when something breaks.
  Works, but painful for post-incident review.
- **Grafana dashboards as code** — Grafana is running, but dashboards were
  clicked together manually. They should be JSON files in git.
- **Alerting on backup content, not just backup job** — current alert fires
  if the cron job fails. It does NOT verify the backup is actually restorable.

---

## Related

- [[IaC = DRY + TRIZ - How I Approach Infrastructure Problems]]
- [[Eigenstack — Sovereign Self-Hosted Cloud (Germany)]]
- [[Reliable Chaos — Designing Infrastructure That Fails Predictably]]
