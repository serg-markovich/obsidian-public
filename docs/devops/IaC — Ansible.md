---
title: IaC — Ansible
description: Configuration management and automation with Ansible — playbooks, roles, inventory
type: note
status: seedling
tags:
  - ansible
  - iac
  - automation
  - devops
---

> 🌱 Seedling — core concepts documented, eigenstack playbooks being added.

## What Ansible Does

Ansible **configures** infrastructure after it exists —
installs software, copies files, manages services, sets permissions.

Agentless: connects via SSH. No daemon running on target hosts.
Idempotent: running a playbook twice produces the same result as running it once.

## Core Components

| Component | Role |
|---|---|
| Inventory | List of hosts and groups to manage |
| Playbook | "Entry point" — YAML description of what to do where |
| Task | Single unit of work (install package, copy file, run command) |
| Role | Logical grouping of tasks, handlers, vars — reusable module (DRY) |
| Handler | Task triggered by another task via `notify` (e.g., restart nginx after config change) |
| Tags | Labels on tasks/roles for selective execution |
| Vars | Variables — make playbooks reusable across environments |

## DRY via Roles

Instead of duplicating Docker installation steps across multiple playbooks:

```yaml
# roles/docker/tasks/main.yml — defined once
- name: Install Docker dependencies
  apt:
    name: "{{ docker_packages }}"
    state: present

# playbooks/eigenstack.yml — used by reference
- hosts: vps_prod
  roles:
    - docker        # reused
    - traefik       # reused
    - nextcloud     # reused
```

## Basic Commands

```bash
# Run full playbook
ansible-playbook -i inventory/hosts.yml playbooks/eigenstack.yml

# Run only tasks tagged 'docker'
ansible-playbook -i inventory/hosts.yml playbooks/eigenstack.yml --tags docker

# Dry run (check mode)
ansible-playbook -i inventory/hosts.yml playbooks/eigenstack.yml --check

# Ad-hoc command (without playbook)
ansible all -i inventory/hosts.yml -m ping
```

## Approaches: Imperative vs Declarative

Ansible supports both:
- **Declarative** (preferred): `apt: name=docker state=present` — describe desired state
- **Imperative**: `command: apt-get install docker` — explicit steps, less idempotent

Prefer declarative modules over `command`/`shell` tasks — they handle idempotency automatically.

## Related
- [[IaC — Terraform]]
