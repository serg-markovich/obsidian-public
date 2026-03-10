---
title: Containers & Docker
description: Docker architecture, key components, and practical commands
type: note
status: seedling
tags:
  - docker
  - containers
  - devops
  - iac
---

> 🌱 Seedling — core concepts documented, examples being added.

## Why Containers?

Before containers: monolithic apps with heavy dependencies, slow updates,
unpredictable environments. Virtualisation solved isolation at the hardware level
but was heavyweight.

Containers isolate at the **Linux kernel level** (namespaces + cgroups) —
same kernel, isolated process spaces. Lighter, faster, portable.

**The key shift:** "works on my machine" → "works anywhere the container runs".

## Docker Architecture

```
Docker CLI  →  Docker Daemon (dockerd)  →  containerd
                      ↓
              Docker Registry (Hub / private)
                      ↓
              Docker Image → Docker Container
```

| Component | Role |
|---|---|
| `dockerd` | Server-side daemon: pulls images, manages containers, networking, logs |
| Docker CLI | Client: sends commands to daemon locally or over network |
| Dockerfile | Build instructions → produces image layers |
| Docker Image | Packaged, layered, immutable application snapshot |
| Docker Registry | Image storage (Docker Hub, Harbor, GHCR) |
| Docker Container | Running instance of an image (a Linux namespace, essentially) |

## Key Commands

```bash
# Images
docker pull nginx:alpine          # pull from registry
docker build -t myapp:1.0 .       # build from Dockerfile
docker rmi myapp:1.0              # remove image

# Containers
docker run -d -p 8080:80 nginx    # run detached, map port
docker exec -it <id> bash         # shell into running container
docker stop <id>                  # graceful stop (SIGTERM)
docker rm <id>                    # remove stopped container

# Inspect
docker logs -f <id>               # follow logs
docker stats                      # live resource usage
docker inspect <id>               # full JSON config
```

## DRY in Docker: Compose

Avoid running containers with long `docker run` commands repeated in scripts.
Use `docker-compose.yml` as the single source of truth:

```yaml
# One .env file, referenced everywhere — DRY
services:
  traefik:
    image: traefik:v3.0
    env_file: .env
  nextcloud:
    image: nextcloud:latest
    env_file: .env          # same .env, not duplicated
```

→ See this pattern in action: [[Eigen-Stack — Sovereign Self-Hosted Cloud (Germany)]]

## Isolation Note

Containers are well-isolated from each other,
but **less isolated from the host** than VMs — they share the kernel.
This is why `docker-socket-proxy` matters in production:
direct access to `/var/run/docker.sock` = potential host root escalation.

→ Mitigated in eigenstack via `docker-socket-proxy` (no direct socket exposure).

## Related
- [[IaC — Terraform]]
- [[IaC — Ansible]]
