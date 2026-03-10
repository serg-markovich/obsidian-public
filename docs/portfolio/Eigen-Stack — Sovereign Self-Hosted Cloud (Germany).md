---
title: Eigenstack — Sovereign Self-Hosted Cloud (Germany)
description: >
  Privacy-first, self-hosted cloud for German small businesses and
  IT professionals. Replaces Google Drive, Dropbox and LastPass —
  DSGVO-compliant, Hetzner Frankfurt, runs itself after setup.
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
> Repository: [github.com/serg-markovich/eigen-stack](https://github.com/serg-markovich/eigen-stack)

## What is Eigen-Stack?

Eigenstack replaces Google Drive, Dropbox, and LastPass with open-source
equivalents — hosted on German infrastructure, owned by you, compliant
with DSGVO from day one.

**Who it's for:**
- IT professionals who want a reproducible, IaC-managed personal stack
- Small German businesses (Freiberufler, Kanzleien, Arztpraxen) exiting
  US-cloud under DSGVO pressure — deployable with or without in-house IT

**How to use it:**
- Self-deploy: clone, fill `.env`, run `make up`
- Managed setup: [contact](mailto:eigen-stack@serg-markovich.de) — I deploy and maintain it for you

> *The name: German eigen — "own" — digital self-ownership.*

## The Problem It Solves

| Challenge | Eigenstack approach |
|---|---|
| Files on US clouds (Google Drive, Dropbox) | Nextcloud AIO on Hetzner Frankfurt |
| Passwords in closed-source managers | Vaultwarden (open-source Bitwarden) |
| German documents lost in paper chaos | Paperless-ngx with German OCR |
| Admin panels exposed to internet | WireGuard VPN — zero public exposure |
| Manual setup that drifts over time | IaC: Terraform + Ansible + Docker Compose |

## The Contradiction This Resolves

> *Cloud is convenient but leaks data.*
> *Self-hosting protects but feels too hard.*
>
> A compromise (e.g. "use a German cloud provider") doesn't resolve this —
> it just moves the trust boundary.
>
> Eigenstack resolves it architecturally: Compose + Ansible reduce operational
> overhead to near-zero. One command deploys the full stack. After that,
> it runs itself.
>
> Convenience restored. Privacy preserved. No compromise.

→ [[IaC = DRY + TRIZ - How I Approach Infrastructure Problems]]
## Architecture
Internet → Hetzner Firewall → Traefik (TLS, rate-limit)  
↓  
┌───────────────┼───────────────┐  
Nextcloud AIO Vaultwarden Paperless-ngx  
↓  
Fail2ban + AppArmor (host security)  
↓  
Prometheus / Netdata / Alertmanager → Telegram


**Hosting:** Hetzner CX32 (4 vCPU, 8GB RAM, Frankfurt) — ~€8.21/month
**Storage:** 100GB volume + 100GB Storage Box (encrypted daily backups)
**Access:** WireGuard VPN for all admin — zero public exposure

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

## Deployment Profiles

```bash
# Passwords + gateway only
docker compose --profile essentials up

# + Document management (Paperless-ngx)
docker compose --profile documents up

# Full stack
docker compose --profile full up
```

Resource footprint (full): ~3.5GB RAM — fits CX32 with 50%+ headroom.

## Security Model: Defence in Depth

1. **Network** — Hetzner Firewall (default-deny) + WireGuard OOB management
2. **Container runtime** — docker-socket-proxy (no direct socket exposure),  
    resource limits
3. **Application** — TLS 1.3, rate limiting, VPN-only admin routes
4. **Host** — Fail2ban, AppArmor, SSH key-only, unattended-upgrades
5. **Backup** — Daily encrypted backups to Hetzner Storage Box,  
    monthly restore verification
    
**RTO: ~30 min** | **RPO: <24h**

## DSGVO / GDPR Compliance

- ✅ Data stored in Germany (Hetzner Frankfurt)
- ✅ TLS 1.3 in transit, AES-256 at rest
- ✅ No third-party trackers or US data processors
- ✅ Nextcloud audit log enabled
- ✅ Prometheus 30-day retention (data minimisation, Art. 5 DSGVO)
- ✅ Deployable as Auftragsverarbeitung (Art. 28 DSGVO)
    

## Project Status

|Component|Status|
|---|---|
|Architecture design|✅ Complete|
|Traefik + Vaultwarden (core)|✅ Written, local testing|
|Nextcloud AIO|🔄 In progress|
|Terraform — Hetzner provisioning|📋 Next|
|Ansible playbooks|📋 Planned|
|Monitoring + alerting|📋 Planned|
|Backup + restore verification|📋 Planned|
|Hetzner VPS deployment|📋 After local MVP validated|

## Related

- [[IaC = DRY + TRIZ - How I Approach Infrastructure Problems]]
- [[Local Voice Transcription Pipeline]]
- [[Obsidian Public Knowledge Base]]

