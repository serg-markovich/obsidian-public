---
title: Monitoring & Observability
description: Prometheus, Grafana, Alertmanager, Netdata — metrics, dashboards, alerting
type: note
status: seedling
tags:
  - monitoring
  - prometheus
  - grafana
  - netdata
  - alertmanager
  - sre
  - devops
---

> 🌱 Seedling — stack defined, eigenstack monitoring patterns being documented.

## The Three Pillars of Observability

| Pillar | What it answers | Tools |
|---|---|---|
| **Metrics** | Is the system healthy? (numbers over time) | Prometheus, Netdata |
| **Logs** | What happened? (events) | Docker logs, Loki |
| **Traces** | Where did the request go? (flow) | Jaeger, Tempo |

For a self-hosted personal stack, metrics + logs cover 95% of needs.

## Stack in eigenstack

```
Netdata     → realtime metrics (1h retention, web UI built-in)
Prometheus  → persistent metrics (30-day retention, queryable)
Alertmanager→ alert routing → Telegram / Email
node-exporter → host-level metrics for Prometheus
```

**Why both Netdata and Prometheus?**
TRIZ contradiction: *realtime visibility* vs *persistent history*.
Netdata excels at live dashboards (zero config). Prometheus handles long-term storage and alerting rules.
Both solve different problems — no compromise needed.

## SLOs Defined for eigenstack

| Metric | Target | Alert threshold |
|---|---|---|
| Uptime | 99.5% | Down > 5 min → CRITICAL |
| Response time | < 500ms p95 | — |
| Disk usage | < 80% | > 80% WARNING, > 90% CRITICAL |
| Memory usage | < 75% | > 85% WARNING |
| Backup success | 100% daily | Failure → CRITICAL |
| SSL expiry | > 7 days | < 7 days → CRITICAL |

## Key Tools

**Prometheus** — open-source, pull-based metrics. Integrates natively with Docker and Kubernetes.
Scrapes `/metrics` endpoints from exporters. PromQL for querying.

**Grafana** — visualisation layer on top of Prometheus (and other sources).
Dashboards as JSON — can be stored in git (IaC for dashboards).

**Netdata** — zero-config realtime monitoring. Auto-discovers Docker containers.
Useful for immediate visibility without setup overhead.

**Alertmanager** — routes Prometheus alerts to notification channels.
In eigenstack: routes to Telegram for immediate mobile notifications.

## Related

- [[IaC = DRY + TRIZ - How I Approach Infrastructure Problems]]
