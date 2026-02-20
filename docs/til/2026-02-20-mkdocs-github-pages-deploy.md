---
title: MkDocs + GitHub Pages Deployment Patterns
date: 2026-02-20
type: til
topic: devops
status: published
level: intermediate
tags:
  - git
  - github-actions
  - mkdocs
  - cicd
  - dns
  - obsidian
---
# TIL: Publishing an Obsidian Vault with MkDocs + GitHub Pages

## What I built

A public knowledge base at [notes.serg-markovich.de](https://notes.serg-markovich.de)
from an Obsidian vault using MkDocs Material, GitHub Actions and Cloudflare DNS.

---

## DevOps patterns applied

### 1. Separation of concerns (multi-repo strategy)
Keep each project in its own repository with independent commit history.
The public vault is a separate repo from the main website — different content,
different audiences, different deploy pipelines.

**Rule:** Never mix concerns in one repo just for convenience.

### 2. Everything as code
No manual changes on GitHub UI (except settings). All config lives in files:
- `mkdocs.yml` — site configuration
- `.github/workflows/deploy.yml` — CI/CD pipeline
- `.gitignore` / `.gitattributes` — repo hygiene

### 3. CI/CD with GitHub Actions
Every `git push` to `main` triggers automatic build and deploy.
No manual rsync, no manual `mkdocs build`.

```yaml
on:
  push:
    branches: [main]
permissions:
  contents: write

