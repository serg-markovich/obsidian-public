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

***

## DevOps patterns applied

### 1. Separation of concerns

Keep each project in its own repository with independent commit history.
The public vault is separate from the main website — different content, different deploy pipelines.

### 2. Everything as code

All config lives in files — never manual changes in GitHub UI:

- `mkdocs.yml` — site configuration
- `.github/workflows/deploy.yml` — CI/CD pipeline
- `.gitignore` / `.gitattributes` — repo hygiene


### 3. CI/CD with GitHub Actions

Every `git push` to `main` triggers automatic build and deploy. Pin `mkdocs<2.0`, not `mkdocs-material` — MkDocs 2.0 is the breaking change.

### 4. Immutable build artifacts

The `site/` folder is never committed — generated fresh on every deploy. Add `site/` to `.gitignore`.

### 5. DNS without proxy for GitHub Pages

Cloudflare orange cloud breaks GitHub Pages SSL validation. Use grey cloud (DNS only) with CNAME pointing to `serg-markovich.github.io`.

***

## Troubleshooting

### Actions runs in 15s and silently fails

**Cause:** YAML syntax error — GitHub ignores invalid workflow files silently.
**Fix:** Recreate with heredoc to avoid indentation issues:

```bash
cat > .github/workflows/deploy.yml << 'EOF'
...
EOF
```


### Permission denied on git push

**Cause:** Remote set to SSH, but no key added to GitHub.
**Fix:**

```bash
git remote set-url origin https://github.com/user/repo.git
```


### GitHub Pages shows Jekyll instead of MkDocs

**Cause:** Auto-generated `jekyll-gh-pages.yml` conflicts with custom workflow.
**Fix:**

```bash
git rm .github/workflows/jekyll-gh-pages.yml
```


### Theme material has no configuration file

**Cause:** MkDocs 2.0 installed — incompatible with mkdocs-material.
**Fix:**

```bash
pip install "mkdocs<2.0" mkdocs-material
```


### github-actions[bot] permission denied on push

**Cause:** Missing permissions block in workflow.
**Fix:**

```yaml
permissions:
  contents: write
```

## Related Notes
- [Obsidian Public Knowledge Base](2026-02-20-obsidian-public-knowledge-base.md)
- [Obsidian Vault Local Setup](2026-02-20-obsidian-vault-local-setup.md)