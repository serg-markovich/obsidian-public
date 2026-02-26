---
title: My Homelab Setup
date: 2026-02-26
type: configuration
topic: homelab
status: active
level: intermediate
tags:
  - homelab
  - ubuntu
  - linux
  - vps
  - docker
  - hestia
  - kubectl
  - terraform
  - ansible
---
# My Homelab Setup

Two-node setup: a local workstation (HP EliteBook) and a remote VPS (Contabo), connected via SSH and managed through CLI.
***
## Local Workstation

**HP EliteBook 845 G8**

| Component | Details                                      |
| --------- | -------------------------------------------- |
| OS        | Ubuntu 24.04.4 LTS (kernel 6.8.0)            |
| CPU       | AMD Ryzen 5 PRO 5650U — 6 cores / 12 threads |
| RAM       | 16 GB                                        |
| Storage   | 1 TB NVMe SSD (LVM + LUKS encryption)        |
| Network   | WiFi — wlp2s0                                |

**Encryption:** Full disk encryption via LUKS on NVMe (`nvme0n1p3_crypt`) with LVM on top — 929 GB root volume.

**Installed tools:**

| Tool      | Version     |
| --------- | ----------- |
| Ubuntu    | 24.04.4 LTS |
| Docker    | 29.2.1      |
| Python    | 3.12.3      |
| Git       | 2.43.0      |
| kubectl   | v1.31.14    |
| Kustomize | v5.4.2      |
| Terraform | v1.14.6     |
| Ansible   | core 2.20.3 |

***

## VPS — Contabo
**Location:** Germany

| Component | Details            |
| --------- | ------------------ |
| OS        | Ubuntu 22.04.5 LTS |
| CPU       | AMD EPYC — 6 vCPUs |
| RAM       | 12 GB              |
| Storage   | 200 GB SSD         |
| Provider  | Contabo            |

**Running services:**

| Service                 | Role                                               |
| ----------------------- | -------------------------------------------------- |
| Nginx                   | Reverse proxy / web server                         |
| Apache2                 | Web server (HestiaCP managed)                      |
| HestiaCP                | Hosting control panel                              |
| MariaDB 11.4            | Database server                                    |
| PHP 8.3 FPM             | PHP runtime                                        |
| Dovecot                 | IMAP/POP3 mail server                              |
| Exim4                   | Mail transfer agent                                |
| BIND (named)            | DNS server                                         |
| Docker 28.3.3           | Container runtime                                  |
| Fail2ban                | Intrusion prevention                               |
| ClamAV                  | Antivirus                                          |
| SpamAssassin            | Spam filtering                                     |
| local-whisper-obsidian  | Voice memo transcription (Faster Whisper, systemd) |
| openwebui-systemd-stack | OpenWebUI + Ollama LLM stack (systemd managed)     |

***

## Repositories

| Repository | Description |
| ---------- | ----------- |
| [local-whisper-obsidian](https://github.com/serg-markovich/local-whisper-obsidian) | Local voice transcription pipeline using Faster Whisper, integrated with Obsidian via systemd |
| [openwebui-systemd-stack](https://github.com/serg-markovich/openwebui-systemd-stack) | Self-hosted OpenWebUI + Ollama stack managed with systemd on VPS |

***

## Network & DNS
DNS and CDN managed through **Cloudflare**:
- `serg-markovich.de` → Contabo VPS IP
- `notes.serg-markovich.de` → CNAME to `serg-markovich.github.io` (DNS only, no proxy)

***

## Related
- [[Obsidian Vault Local Setup]]
- [[Obsidian Public Knowledge Base]]
- [[Local Voice Transcription Pipeline]]

