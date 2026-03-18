---
title: "TIL: Portable systemd+Docker Installations via Template Substitution"
date: 2026-03-19
type: guide
topic: devops
status: published
level: intermediate
tags: [til, systemd, docker, makefile, portability]
author: Serg Markovych
location: Stuttgart, Germany
---

## The Problem

Hardcoded paths in systemd units and `.desktop` files break when you move a project. Manual `cp` workflows don't scale. Users report "it works on my machine" — but not after `mv ~/old ~/new`.

## The Pattern

**Store templates, not working copies. Substitute at install time.**

```ini
# systemd/openwebui.service.template
[Service]
WorkingDirectory=%%INSTALL_PATH%%
ExecStart=/usr/bin/docker compose up -d
```

```makefile
# Makefile
install:
	sed "s|%%INSTALL_PATH%%|$(PWD)|g" systemd/openwebui.service.template \
		> ~/.config/systemd/user/openwebui.service
	systemctl --user daemon-reload
```

## Critical Details Most Guides Skip

| Issue | Wrong | Right | Why |
|-------|-------|-------|-----|
| `.desktop` Exec | `bash -c '%%PATH%%/script.sh'` | `bash %%PATH%%/script.sh` | `-c` executes *contents* of file, not the file itself |
| Multi-command Exec | `bash -c 'cmd1; cmd2'` | `bash -c "cmd1; cmd2"` | Single quotes prevent variable expansion |
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

## Why This Matters for Local-First DevOps

- 🧳 **Portable**: Clone anywhere, `make install` just works
- 🔧 **Maintainable**: One source of truth (templates), not scattered working copies
- 🤝 **User-respectful**: No "edit this config file" for new users
- 🇩🇪 **Stuttgart-grade**: Precision engineering for privacy-first infrastructure

This pattern now powers all my eigenstack projects — because infrastructure should move with you, not trap you.

---
## Related

- [[Battery-Optimized Local AI Stack (Open WebUI + Ollama)]]
- [[Reliable Chaos — Designing Infrastructure That Fails Predictably]]