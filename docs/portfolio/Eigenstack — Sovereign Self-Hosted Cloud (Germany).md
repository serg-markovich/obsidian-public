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

> 🌱 This project is actively being built. Architecture is defined, code is in progress.
> GitHub repo is currently private — public release planned after MVP validation.

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

The stack uses Compose profiles for modular, phased deployment:

```bash
# Minimal — gateway only (testing)
docker compose --profile core up

# Production minimal — core apps
docker compose --profile core --profile apps up

# Production + monitoring (recommended)
docker compose --profile core --profile apps --profile monitoring up

# Full stack
docker compose --profile full up
```

Resource footprint (full stack): ~3.5GB RAM — fits CX32 with 50%+ headroom.

## Security Model: Defence in Depth

Five layers, each independent:

1. **Network** — Hetzner Firewall (default-deny) + WireGuard OOB management
2. **Container runtime** — docker-socket-proxy (no direct socket exposure), resource limits, no privileged containers
3. **Application** — TLS 1.3 enforcement, rate limiting (10 req/sec), VPN-only admin routes
4. **Host** — Fail2ban, AppArmor profiles, SSH key-only, unattended-upgrades
5. **Backup** — Daily encrypted backups to offline Hetzner Storage Box, monthly restore verification

**RTO: ~30 minutes** (Terraform reprovision + volume restore from backup)  
**RPO: <24 hours** (daily backup cadence)

## DSGVO / GDPR Compliance

- ✅ Data stored in Germany (Hetzner Frankfurt)
- ✅ TLS 1.3 in transit
- ✅ No third-party trackers
- ✅ Nextcloud audit log enabled
- ✅ Prometheus 30-day retention (aligned with data minimisation)
- ✅ Backup deletion policy configurable

## IaC = DRY + TRIZ in Practice

**DRY:** Single `.env` file as source of truth for all service configs.
One Makefile (`make up`, `make down`, `make backup`) — no duplicated shell commands.
Shared Compose network definitions — no per-service copy-paste.

**TRIZ contradiction resolved:**
> *Privacy vs convenience* — using cloud services is easy but leaks data;
> self-hosting protects data but is "too hard".
>
> Resolution: Compose profiles + Ansible automation reduce operational overhead
> to near-zero. One command deploys the full stack. Convenience restored,
> privacy preserved. No compromise.

This is the core demonstration of the [[IaC = DRY + TRIZ - How I Approach Infrastructure Problems]] framework.

## Project Status

| Component | Status |
|---|---|
| Architecture design | ✅ Complete |
| Docker Compose (core + apps profiles) | 🔄 In progress |
| Terraform (Hetzner provisioning) | 🔄 In progress |
| Ansible playbooks | 📋 Planned |
| Monitoring stack | 📋 Planned |
| Backup scripts + verification | 📋 Planned |
| Public GitHub release | 📋 After MVP validation |

## Planned Public Release

The repository will be made public after:
- [ ] `docker compose --profile full up` runs without errors end-to-end
- [ ] Terraform provisions a clean Hetzner CX32 reproducibly
- [ ] Backup and restore verified on fresh VPS
- [ ] README quick-start tested by one external person

## Related Notes

-  [[IaC = DRY + TRIZ - How I Approach Infrastructure Problems]]
- [[Obsidian Public Knowledge Base]]


