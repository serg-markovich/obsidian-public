---
title: Docker entrypoint as a drop-in for systemd services
date: 2026-03-02
topic: devops
tags:
  - docker
  - systemd
  - shell
  - til
---

# TIL: Docker entrypoint as a drop-in for systemd services

When containerizing a tool that was originally managed by systemd, you don't
need to run systemd inside the container. The entrypoint script IS the service.

## The pattern

A systemd unit runs a script as a long-lived process:

    [Service]
    ExecStart=/home/user/.config/local-whisper-obsidian/watch.sh

A Docker container does the same — the entrypoint just replaces systemd as
the process supervisor:

    ENTRYPOINT ["/app/bin/watch-docker.sh"]

## What changes

The script can no longer source `~/.config/.../.env` — that path doesn't
exist in a container. Environment variables come from `docker-compose.yml`
instead. Solution: per-variable fallback with a required check.

    MODEL="${MODEL:-small}"
    : "${SCAN_PATHS:?SCAN_PATHS is not set}"

## What stays the same

- `inotifywait` loop — identical logic
- `flock` lockfile — identical
- Call to `transcribe.py` — identical

The core is untouched. Only the config source changes.

## Lesson

Splitting watcher and transcriber into separate scripts (single responsibility)
made containerization trivial. The Docker version was a new entrypoint, not
a rewrite.

