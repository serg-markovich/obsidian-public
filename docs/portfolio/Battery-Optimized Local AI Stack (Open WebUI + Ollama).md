---
title: Battery-Optimized Local AI Stack (Open WebUI + Ollama)
date: 2026-02-25
type: project
topic: devops
status: published
level: intermediate
tags:
  - docker
  - systemd
  - linux
  - self-hosted
  - ai
---

# Project: Battery-Optimized Local AI Stack

A production-ready approach to running Open WebUI and Ollama locally, utilizing systemd user services, Docker bridge networking, and desktop integration to prevent idle battery drain.

**Links:**

* 💻 **Source Code:** [serg-markovich/openwebui-systemd-stack](https://github.com/serg-markovich/openwebui-systemd-stack)
* 📖 **Architecture Docs:** [Read the full deep-dive](https://github.com/serg-markovich/openwebui-systemd-stack/blob/main/docs/ARCHITECTURE.md)

---

## The Problem

Most guides for running local LLMs suggest a simple `docker run` or setting `restart: unless-stopped` in a compose file. While fine for a server, running a constantly spinning Docker container on a laptop like an HP EliteBook 845 G8 running Ubuntu 24.04 results in severe battery drain. I noticed a 30% overnight battery drop just from idle containers consuming RAM and CPU cycles.

The goal was to build a system that offers the convenience of a native desktop application but remains fully containerized, isolated, and strictly strictly on-demand.

---

## Architecture & Key Decisions

To achieve zero idle resource consumption while maintaining a seamless user experience, I engineered a stack combining `systemd`, `docker compose`, and Freedesktop standards.

### 1. Manual Control via systemd User Services
Instead of running Docker containers as root-level daemons, I mapped the `docker compose` lifecycle to a `systemd` user service. 
* **Discovery:** A standard `Type=simple` service stays in an "activating" state forever because the `compose up` process exits after spinning up the containers. 
* **Solution:** Using `Type=oneshot` combined with `RemainAfterExit=yes` correctly tracks the state of the containers, allowing for clean `systemctl --user start/stop` commands without requiring `sudo`. This switch to manual control immediately yielded 20-30% daily battery savings.

### 2. Bridge Networking vs. Host Mode
While host networking is easier for prototyping, I opted for Docker bridge networking for better isolation. 
* **The Gotcha:** Ollama defaults to listening on `127.0.0.1`, making it unreachable from the Open WebUI container. 
* **The Fix:** Passing `OLLAMA_HOST=0.0.0.0` and routing the API calls through the Docker gateway IP (`172.17.0.1`) ensures strict container isolation without sacrificing connectivity.

### 3. Desktop Integration
To avoid opening a terminal every time I wanted to chat with an LLM, I created standard `.desktop` XDG launchers. This bridges the CLI automation with the graphical environment, polling the container's health and opening the browser only when the API is actually ready to accept connections.

---

## Results & Impact

* **Efficiency:** Recovered 20-30% of daily battery life by strictly controlling container uptime.
* **Security:** Ran entirely as a non-root user service with isolated bridge networking.
* **UX:** One-click launch from the application menu, indistinguishable from a native app.

## Related
- [[Reliable Desktop Integration for Local Docker Services (XDG & systemd)]]
