---
title: Ansible Collections Must Be Declared for CI
date: 2026-03-29
type: til
topic: devops
status: published
level: intermediate
tags:
  - ansible
  - ci
  - github-actions
  - community-general
---
## The Problem

community.general.ufw works locally but CI fails with:

```
couldn't resolve module/action 'community.general.ufw'
```

Local machine has collections from previous projects cached.
CI runner starts clean — nothing pre-installed.

## The Fix

```yaml
# requirements.yml
collections:
  - name: community.general
    version: ">=8.0.0"
  - name: ansible.posix
    version: ">=1.5.0"
```

```yaml
# .github/workflows/ci.yml
- name: Install collections
  run: ansible-galaxy collection install -r requirements.yml
```

Add this step before ansible-lint runs. That's it.

## Why It Matters

| Environment | Without requirements.yml | With requirements.yml |
|---|---|---|
| Local machine | Works (cached) | Works |
| CI runner | Fails | Works |
| Fresh install | Fails | Works |

requirements.yml is to Ansible what package.json is to Node —
the explicit contract between your code and its dependencies.
"Works on my machine" is not a declaration.

## Related

- [[eigenbase — Ansible Workstation Provisioning]]