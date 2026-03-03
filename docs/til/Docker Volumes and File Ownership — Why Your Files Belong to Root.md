---
title: Docker Volumes and File Ownership — Why Your Files Belong to Root
date: 2026-03-03
type: til
topic: devops
status: published
level: intermediate
tags:
  - til
  - docker
  - linux
  - devops
---

# TIL: Docker Volumes and File Ownership — Why Your Files Belong to Root

## Summary

When mounting a host directory as a Docker volume, files created inside the
container are owned by `root` on the host — even if your host user has full
access to the directory. There is a clean, repeatable fix that doesn't involve
prefixing every command with environment variables.

---

## The Problem

A containerized transcription service writes `.md` files into a mounted vault:

```
volumes:
  - ${VAULT_PATH}:/vault
```

On the host, the output looks like this:

```
-rw-r--r-- 1 root   root   Recording.md
-rw-rw-r-- 1 sergey sergey Recording.m4a
```

The next time a host-side service (systemd) tries to overwrite the same file,
it gets:

```
ERROR Transcription failed: [Errno 13] Permission denied: '/vault/Recording.md'
```

**Why it happens:** Docker containers run as `root` (UID 0) by default. Files
created inside a container on a bind-mounted volume inherit that UID on the
host — regardless of who owns the directory.

---

## The Wrong Fix

```bash
# Antipattern: leaks into muscle memory, breaks in CI, breaks make targets
UID=$(id -u) GID=$(id -g) docker compose up -d
```

`UID` is a readonly variable in bash. It breaks. And even if you use a
different name, you're encoding runtime state into every invocation instead
of into configuration.

---

## The Right Fix

**Step 1 — `docker-compose.yml`:**

```yaml
services:
  whisper-obsidian:
    user: "${CURRENT_UID}:${CURRENT_GID}"
```

**Step 2 — `docker/.env.example`:**

```bash
# Host user permissions — prevents root-owned files on mounted volumes
# Run: id -u && id -g
CURRENT_UID=1000
CURRENT_GID=1000
```

**Step 3 — `Makefile`:**

```makefile
docker-up:
	@test -f docker/.env || { echo "Error: docker/.env not found. Run: cp docker/.env.example docker/.env"; exit 1; }
	docker compose -f docker/docker-compose.yml --env-file docker/.env up -d
```

Docker Compose reads `.env` automatically. No prefixes. No readonly variable
errors. The guard ensures users configure before running.

---

## The Hidden Second Problem

If the container previously ran as root, the model cache volume is also
owned by root:

```
whisper_models:/root/.cache/huggingface
```

A non-root user inside the container cannot write to `/root/.cache`.
The fix: use a neutral mount path and set `HF_HOME` explicitly.

```yaml
environment:
  - HF_HOME=/cache/huggingface
volumes:
  - whisper_models:/cache/huggingface
```

If the volume was already created as root, recreate it:

```bash
docker compose down
docker volume rm <project>_whisper_models
docker compose up -d
```

---

## Checklist

When adding Docker support to any tool that writes files to a host volume:

- [ ] Set `user: "${CURRENT_UID}:${CURRENT_GID}"` in `docker-compose.yml`
- [ ] Add `CURRENT_UID` / `CURRENT_GID` to `.env.example` with `id -u` / `id -g` instructions
- [ ] Avoid `/root/.cache` as a volume mount path — use a neutral path + explicit env var
- [ ] Add a guard in `Makefile` that fails early if `.env` is missing

---

## Related

- [[Three Patterns for Reliable systemd File Watchers]]
- [[Docker entrypoint as a drop-in for systemd services]]
