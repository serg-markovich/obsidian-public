---
title: IaC — Terraform
description: Infrastructure provisioning with Terraform — providers, state, modules
type: note
status: seedling
tags:
  - terraform
  - iac
  - hetzner
  - azure
  - devops
---

> 🌱 Seedling — core concepts documented, Hetzner and Azure patterns being added.

## What Terraform Does

Terraform provisions **infrastructure** — servers, networks, databases, DNS records —
from declarative configuration files (`.tf`).

It does NOT configure what's running on those servers (that's Ansible's job).

```
Terraform = "create a CX32 VPS on Hetzner with this SSH key and firewall"
Ansible   = "install Docker on that VPS and configure these services"
```

## Core Concepts

| Concept | Role |
|---|---|
| `main.tf` | Primary configuration file |
| Provider | Plugin for a specific platform (Hetzner, Azure, AWS) |
| Resource | A thing to create (server, network, volume) |
| State | Terraform's record of what it created (`terraform.tfstate`) |
| Module | Reusable, parameterised group of resources (DRY!) |
| `terraform.tfvars` | Variable values — keep secrets here, never commit to git |

## DRY via Modules

Instead of copy-pasting server resource blocks for dev/staging/prod:

```hcl
# modules/hetzner-server/main.tf — defined once
resource "hcloud_server" "this" {
  name        = var.name
  server_type = var.server_type
  image       = "ubuntu-24.04"
  ssh_keys    = var.ssh_key_ids
}

# root main.tf — used multiple times, parameterised
module "vps_prod" {
  source      = "./modules/hetzner-server"
  name        = "eigen-prod"
  server_type = "cx32"
  ssh_key_ids = [hcloud_ssh_key.main.id]
}
```

## Basic Workflow

```bash
terraform init      # download providers
terraform plan      # preview changes (always do this first)
terraform apply     # create/update infrastructure
terraform destroy   # tear down (careful in production)
```

## Providers Used in eigenstack

- **Hetzner Cloud** (`hcloud`) — VPS, volumes, firewalls, SSH keys
- **Cloudflare** — DNS records, CNAME for subdomains
- **Azure** (`azurerm`) — used in [[privat/1_projects/DevOps Azure EnterPrise LZ|DevOps Azure EnterPrise LZ]]

Provider registry: [registry.terraform.io](https://registry.terraform.io)

## Related
- [[IaC — Ansible]]
