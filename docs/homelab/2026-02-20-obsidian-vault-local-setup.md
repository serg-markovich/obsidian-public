---
title: Obsidian Vault Local Setup
date: 2026-02-20
type: configuration
topic: homelab
status: active
level: beginner
tags:
  - obsidian
  - git
  - ubuntu
  - homelab
  - knowledge-management
---

# Obsidian Vault Local Setup

Local configuration of the Obsidian vault on Ubuntu 24.04 (HP EliteBook 845 G8) with a public subfolder connected to GitHub and deployed via MkDocs Material.

***

## Folder structure

```
~/obsidian/
├── .obsidian/              ← Obsidian config, plugins (local only)
├── 0_inbox/                ← raw captures, voice transcripts
├── 1_journal/
├── 2_areas/
├── 3_projects/
├── 4_resources/
├── 5_system/               ← templates, workflow notes
├── 6_archive/
└── public/                 ← separate git repo (obsidian-public)
    ├── .git/
    ├── .github/workflows/
    ├── docs/
    │   ├── azure/
    │   ├── devops/
    │   ├── homelab/
    │   ├── portfolio/
    │   └── til/
    └── mkdocs.yml
```

The `public/` folder is an independent git repository nested inside the vault. The outer vault has no git — only `public/` is version controlled.

***

## Git isolation strategy

The `public/` repo `.gitignore` excludes:

```
.obsidian/          ← plugins, API keys, personal config
_inbox/             ← raw unprocessed notes
site/               ← MkDocs build output
*.canvas            ← Obsidian canvas files
```

This ensures only finished, intentional content reaches the public repository.

***

## Daily publishing workflow

```bash
# 1. Write note in Obsidian, save to ~/obsidian/public/docs/
# 2. When ready to publish:
cd ~/obsidian/public
git add docs/
git commit -m "add: note title"
git push
# GitHub Actions builds and deploys automatically
```

No auto-commit. Every push is intentional — the public git history is clean and visible to potential employers.

***

## GitHub Actions pipeline

On every push to `main`:

1. Installs `mkdocs<2.0` and `mkdocs-material`
2. Runs `mkdocs gh-deploy --force`
3. Pushes built site to `gh-pages` branch
4. GitHub Pages serves at `notes.serg-markovich.de`

Full pipeline: [deploy.yml](https://github.com/serg-markovich/obsidian-public/blob/main/.github/workflows/deploy.yml)

***

## DNS configuration

```
Cloudflare DNS:
Type:   CNAME
Name:   notes
Target: serg-markovich.github.io
Proxy:  DNS only (grey cloud)
```

SSL is handled automatically by GitHub Pages via Let's Encrypt.

***

## Related

- [Portfolio: Obsidian Public Knowledge Base](2026-02-20-obsidian-public-knowledge-base.md)
- [MkDocs + GitHub Pages Deployment Patterns](2026-02-20-mkdocs-github-pages-deploy.md)
