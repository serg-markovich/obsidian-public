---
title: Obsidian Public Knowledge Base
date: 2026-02-20
type: project
topic: devops
status: active
level: intermediate
tags:
  - obsidian
  - mkdocs
  - github-pages
  - cicd
  - knowledge-management
---

# Obsidian Public Knowledge Base

Public knowledge base built with Obsidian and deployed as a static site via MkDocs Material and GitHub Actions.

**Repository:** [github.com/serg-markovich/obsidian-public](https://github.com/serg-markovich/obsidian-public)  
**Live site:** [notes.serg-markovich.de](https://notes.serg-markovich.de)

***

## Problem

Obsidian is great for private note-taking, but sharing knowledge publicly requires a separate publishing workflow — without paying for Obsidian Publish.

***

## Solution

A public subfolder of the Obsidian vault connected to a dedicated git repository. Every `git push` triggers GitHub Actions which builds a static site with MkDocs Material and deploys it to GitHub Pages under a custom subdomain.

***

## Stack

| Tool | Role |
|---|---|
| Obsidian | Writing environment |
| MkDocs Material | Static site generator |
| GitHub Actions | CI/CD — build and deploy on push |
| GitHub Pages | Hosting |
| Cloudflare | DNS — CNAME to github.io |
| Let's Encrypt | SSL — auto via GitHub Pages |

***

## Architecture

```
~/obsidian/public/          ← git root (this repo)
├── .github/workflows/
│   └── deploy.yml          ← GitHub Actions pipeline
├── docs/                   ← all content here
│   ├── index.md
│   ├── azure/
│   ├── devops/
│   ├── homelab/
│   ├── portfolio/
│   └── til/
└── mkdocs.yml              ← site configuration
```

On every push to `main`:

1. GitHub Actions installs `mkdocs<2.0` and `mkdocs-material`
2. Runs `mkdocs gh-deploy --force`
3. Pushes built site to `gh-pages` branch
4. GitHub Pages serves it at `notes.serg-markovich.de`

***

## Key decisions

**Separate repo from main vault** — the public repo has its own git history, independent of private notes. Only content placed in `docs/` is published.

**MkDocs over Quartz** — simpler setup, better Python ecosystem integration, no Node.js dependency.

**Manual publishing workflow** — no auto-commit on every Obsidian save. Each commit is intentional, resulting in a clean public git history visible to potential employers.

***

## Related

- [TIL: MkDocs + GitHub Pages Deployment Patterns](2026-02-20-mkdocs-github-pages-deploy.md)
