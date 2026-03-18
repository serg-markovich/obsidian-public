---
title: Portable systemd+Docker via Makefile Template Substitution
date: 2026-03-19
type: til
topic: devops
status: published
level: intermediate
tags:
  - systemd
  - makefile
  - portability
  - linux
---

## The Problem

Hardcoded paths break silently after `mv ~/projects ~/work`. No errors — just services that don't start. 

## The Pattern

Store templates with `%%INSTALL_PATH%%`. Substitute at install time.

```ini
# systemd/openwebui.service.template
[Service]
WorkingDirectory=%%INSTALL_PATH%%
ExecStart=/usr/bin/docker compose up -d
```

```makefile
install:
	sed "s|%%INSTALL_PATH%%|$(PWD)|g" systemd/*.template \
		> ~/.config/systemd/user/*.service
	systemctl --user daemon-reload
```

## Critical Details Most Guides Skip

| Issue | Wrong | Right | Why |
|-------|-------|-------|-----|
| `.desktop` Exec | `bash -c \'%%PATH%%/script.sh\'` | `bash %%PATH%%/script.sh` | `-c` executes *contents* of file, not the file itself |
| Multi-command Exec | `bash -c \'cmd1; cmd2\'` | `bash -c "cmd1; cmd2"` | Single quotes prevent variable expansion |
| Makefile indentation | Spaces | **Tabs** | Make silently fails with spaces |
| systemd WorkingDirectory | `%h/project` | `%%INSTALL_PATH%%` + substitution | `%h` is static; template enables portability |

## Verification (30 seconds)

```bash
# After make install, verify substitution worked
grep WorkingDirectory ~/.config/systemd/user/openwebui.service
# Expected: /your/actual/path, not %%INSTALL_PATH%%

# Test portability: clone to /tmp and reinstall
cd /tmp && git clone <repo> test && cd test && make install
grep WorkingDirectory ~/.config/systemd/user/openwebui.service
# Should show /tmp/test — no manual edits needed
```

## Why This Matters

- Portable: clone anywhere, `make install` works
- Maintainable: templates = one source of truth
- User-friendly: no "edit config" instructions

Tested on Ubuntu 24.04 - [[My Homelab Setup]]

Infrastructure should move with you, not trap you.

## Related Notes

- [[Battery-Optimized Local AI Stack (Open WebUI + Ollama)]]