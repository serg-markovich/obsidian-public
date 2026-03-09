---
title: Eigenstack — Sovereign Self-Hosted Cloud (Germany)
description: A reproducible, privacy-first personal cloud infrastructure for IT professionals in Germany. Built with IaC principles on Hetzner VPS.
type: project
status: seedling
tags:
  - docker
  - self-hosting
  - privacy
  - iac
  - traefik
  - nextcloud
  - vaultwarden
  - hetzner
  - dsgvo
  - ansible
  - terraform
---

> 🌱 MVP in progress — core stack (Traefik + Vaultwarden) running locally.
> Repository is public: [github.com/serg-markovich/eigen-stack](https://github.com/serg-markovich/eigen-stack)

## What is eigenstack?

A sovereign, self-hosted personal cloud infrastructure designed for IT professionals in Germany.
The goal: full control over your files, passwords, and documents —
hosted on German infrastructure, DSGVO-compliant, deployed with a single command.

The name comes from the German *eigen* — "own", "self" — reflecting digital self-ownership.

## The Problem It Solves

| Challenge | eigenstack approach |
|---|---|
| Files on US clouds (Google Drive, Dropbox) | Nextcloud AIO on Hetzner Frankfurt |
| Passwords in closed-source managers | Vaultwarden (open-source Bitwarden) |
| German documents lost in paper chaos | Paperless-ngx with German OCR |
| Admin panels exposed to internet | WireGuard VPN — zero public exposure |
| Manual setup that drifts over time | IaC: Terraform + Ansible + Docker Compose |

## Architecture Overview

```
Internet → Hetzner Firewall → Traefik (TLS, rate-limit)
                                    ↓
                    ┌───────────────┼───────────────┐
               Nextcloud AIO   Vaultwarden    Paperless-ngx
                                    ↓
                    Fail2ban + AppArmor (host security)
                                    ↓
               Prometheus / Netdata / Alertmanager → Telegram
```

**Hosting:** Hetzner CX32 (4 vCPU, 8GB RAM, Frankfurt) — ~€8.21/month
**Storage:** 100GB persistent volume + 100GB Storage Box (automated backups)
**Access:** WireGuard VPN for all admin endpoints — zero public exposure

## Stack

| Layer | Tool | Role |
|---|---|---|
| Edge Gateway | Traefik v3 | Routing, Auto-SSL (Let's Encrypt), HTTP/3 |
| Files & Calendar | Nextcloud AIO | WebDAV, Collectives, Tasks |
| Passwords | Vaultwarden | Bitwarden-compatible API |
| Documents | Paperless-ngx | German OCR, filing, retention |
| VPN | WireGuard (systemd) | Out-of-band management |
| IDS | Fail2ban | Brute-force protection |
| Monitoring | Netdata + Prometheus | Realtime + persistent metrics |
| Alerting | Alertmanager | Telegram/Email notifications |
| IaC Infra | Terraform | Hetzner VPS provisioning |
| IaC Config | Ansible | Idempotent service configuration |

## Deployment Profiles (Docker Compose)

```bash
# Core only — gateway + security (local dev)
docker compose up -d

# Production minimal
docker compose --profile core --profile apps up

# Full stack
docker compose --profile full up
```

Resource footprint (full stack): ~3.5GB RAM — fits CX32 with 50%+ headroom.

## Security Model: Defence in Depth

1. **Network** — Hetzner Firewall (default-deny) + WireGuard OOB management
2. **Container runtime** — docker-socket-proxy (no direct socket exposure), resource limits
3. **Application** — TLS 1.3, rate limiting, VPN-only admin routes
4. **Host** — Fail2ban, AppArmor, SSH key-only, unattended-upgrades
5. **Backup** — Daily encrypted backups to offline Hetzner Storage Box, monthly restore verification

**RTO: ~30 minutes** | **RPO: <24 hours**

## DSGVO / GDPR Compliance

- ✅ Data stored in Germany (Hetzner Frankfurt)
- ✅ TLS 1.3 in transit
- ✅ No third-party trackers
- ✅ Nextcloud audit log enabled
- ✅ Prometheus 30-day retention (data minimisation)

## IaC = DRY + TRIZ in Practice

**DRY:** Single `.env` as source of truth. One `Makefile` (`make up`, `make down`, `make backup`).
Shared Compose network definitions — no per-service copy-paste.

**TRIZ contradiction resolved:**
> *Privacy vs convenience* — cloud is easy but leaks data; self-hosting protects but feels "too hard".
> Resolution: Compose + Ansible reduce ops overhead to near-zero. One command deploys the full stack.
> Convenience restored, privacy preserved. No compromise.

→ [[IaC = DRY + TRIZ - How I Approach Infrastructure Problems]]

## Project Status

| Component | Status |
|---|---|
| Architecture design | ✅ Complete |
| Docker Compose — core + Vaultwarden | ✅ Written, local testing |
| Docker Compose — Nextcloud AIO | 📋 Next |
| Terraform (Hetzner provisioning) | 📋 Planned |
| Ansible playbooks | 📋 Planned |
| Monitoring stack | 📋 Planned |
| Backup scripts + verification | 📋 Planned |
| Hetzner VPS deployment | 📋 After local MVP validated |

## Related

- [[IaC = DRY + TRIZ - How I Approach Infrastructure Problems]]
- [[Obsidian Public Knowledge Base]]
