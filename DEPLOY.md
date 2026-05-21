# Deployment Guide

This app runs on the **Internet Computer (ICP)** blockchain, managed through the **Caffeine** platform. There is no traditional server to provision or maintain — your backend and frontend both live as ICP **canisters** (smart contracts). State persists automatically across deploys.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [First Deploy](#2-first-deploy)
3. [Custom Domain Setup](#3-custom-domain-setup)
4. [Subsequent Deploys](#4-subsequent-deploys)
5. [Team Collaboration](#5-team-collaboration)
6. [Before You Go Live Checklist](#6-before-you-go-live-checklist)

---

## 1. Prerequisites

Install the following on the machine you will deploy from:

| Tool | Install command | Purpose |
|------|----------------|---------|
| Node.js 20+ | [nodejs.org](https://nodejs.org) | Required by the CLI |
| pnpm | `npm install -g pnpm` | Frontend package manager |
| mops | `npm install -g ic-mops` | Motoko package manager |
| Caffeine CLI | `npm install -g @caffeineai/cli` | Build and deploy |

Verify everything is in place:

```bash
node --version      # should be 20+
pnpm --version
mops --version
caffeine --version  # should print @caffeineai/cli 0.1.0-dev.x or later
```

---

## 2. First Deploy

### Step 1 — Authenticate

```bash
caffeine auth login
```

This opens a browser window. Sign in with your Caffeine account (the one that owns this project). Once done, the terminal will confirm you are logged in.

### Step 2 — Install all dependencies

Run this once from the **project root**:

```bash
caffeine install
```

This runs both `pnpm install` (frontend) and `mops install` (backend) across the workspace.

### Step 3 — Disable mock mode

Before building for production, open `src/frontend/src/lib/backend.ts` and set:

```ts
export const MOCK_MODE = false;
```

> **Why:** `MOCK_MODE = true` bypasses the real ICP canister and uses hardcoded fake data. This is fine for local development but must be `false` in production so real purchases, leads, and admin actions work.

### Step 4 — Build the project

```bash
caffeine build
```

This runs the full build pipeline:
- Backend: `mops build` then `pnpm bindgen` (compiles Motoko → WASM, generates frontend bindings)
- Frontend: `pnpm build` (Vite build → `dist/`)

### Step 5 — Preview / Deploy

```bash
caffeine preview
```

This uploads your locally-built project to Caffeine's cloud. After this step, Caffeine fills in `env.json` with the live canister IDs:

```json
{
  "backend_canister_id": "xxxxx-xxxxx-xxxxx-xxxxx-cai",
  "backend_host": "https://ic0.app",
  "project_id": "...",
  "storage_gateway_url": "https://...",
  "ii_derivation_origin": "https://xxxxx.ic0.app"
}
```

Your app is now live at: `https://[frontend-canister-id].ic0.app`

Note this canister ID — you will need it for the custom domain step.

---

## 3. Custom Domain Setup

ICP supports any domain you own. The process involves three things: a file already in this repo, DNS records at your registrar, and a one-time registration command.

### Step 1 — Update the `ic-domains` file

Open `src/frontend/public/.well-known/ic-domains` and replace the placeholder with your actual domain:

```
yourdomain.com
```

If you also want `www.yourdomain.com` to work, add it on a second line:

```
yourdomain.com
www.yourdomain.com
```

Rebuild and redeploy after this change so the file is live on the canister:

```bash
caffeine build && caffeine preview
```

### Step 2 — Add DNS records

Log into your domain registrar (Namecheap, Cloudflare, GoDaddy, etc.) and add these records. Replace `yourdomain.com` with your actual domain and `[CANISTER-ID]` with your frontend canister ID from `env.json`.

> **If using Cloudflare:** disable the orange cloud proxy (set to DNS-only / grey cloud) for these records. ICP handles its own TLS.

| Type | Name | Value |
|------|------|-------|
| `CNAME` | `yourdomain.com` | `[CANISTER-ID].icp1.io` |
| `CNAME` | `_acme-challenge.yourdomain.com` | `_acme-challenge.yourdomain.com.icp2.io` |

If you want `www` as well, add a second pair:

| Type | Name | Value |
|------|------|-------|
| `CNAME` | `www.yourdomain.com` | `[CANISTER-ID].icp1.io` |
| `CNAME` | `_acme-challenge.www.yourdomain.com` | `_acme-challenge.www.yourdomain.com.icp2.io` |

DNS changes can take a few minutes to a few hours to propagate.

### Step 3 — Register the domain with ICP

Once DNS has propagated, run this command (replace `yourdomain.com` with your domain):

```bash
curl -sLv -X POST \
  -H 'Content-Type: application/json' \
  https://icp0.io/registrations \
  --data '{"name": "yourdomain.com"}'
```

A successful response gives you a registration ID:

```json
{"id":"abc123..."}
```

### Step 4 — Check registration status

Poll with the ID from the previous step until the status is `Available`:

```bash
curl -sLv https://icp0.io/registrations/abc123...
```

Statuses you may see:

| Status | Meaning |
|--------|---------|
| `PendingOrder` | ICP is requesting a TLS certificate |
| `PendingChallengeResponse` | Waiting on DNS to propagate |
| `PendingAcmeApproval` | Certificate authority is approving |
| `Available` | Domain is live and HTTPS is active |
| `Failed` | Something went wrong — check DNS records |

Once `Available`, your app is accessible at `https://yourdomain.com`.

> **For `www` redirect:** register `www.yourdomain.com` as a separate domain using the same `curl` command, pointing to the same canister.

---

## 4. Subsequent Deploys

Every time you make code changes and want to push them live:

```bash
# From the project root
caffeine build
caffeine preview
```

That's it. ICP canisters use **orthogonal persistence** — all stored data (products, leads, FAQs, settings) survives upgrades automatically. You do not need to run migrations or worry about data loss on deploy.

If you only changed frontend code (no Motoko changes), the build is faster because `mops build` will detect no changes.

---

## 5. Team Collaboration

### Adding a collaborator to the Caffeine project

The project owner shares the project ID (from `caffeine.toml` root: `id = "my-app"`). A collaborator clones it:

```bash
caffeine auth login           # log in with their own Caffeine account
caffeine projects clone <id>  # pulls the project to their machine
```

After cloning, they install dependencies and can build:

```bash
caffeine install
caffeine build
caffeine preview
```

### Deploying from a different machine

Any machine with the Caffeine CLI, the correct project ID, and an authorized Caffeine account can deploy. The workflow is the same as above — `caffeine auth login`, then `caffeine build && caffeine preview`.

### Granting admin access to a new team member (in-app)

If a team member also needs admin access to the live site (manage products, view leads, etc.), they need their **Internet Identity principal ID**. To get it:

1. They visit [identity.ic0.app](https://identity.ic0.app) and create an Internet Identity anchor.
2. They log into the live site and copy their principal ID from the admin panel's "Admin Management" card.
3. You (an existing admin) paste their principal ID into the "Add Admin" field in the admin panel and click "Add Admin".

From that point, they can log in and access the admin section.

### Working with Git

This project is a normal Git repo. Standard Git workflow applies:

```bash
git add .
git commit -m "your message"
git push                   # push to shared remote (GitHub, GitLab, etc.)
```

> Tip: keep `MOCK_MODE = true` in `src/frontend/src/lib/backend.ts` on your development branch and only set it to `false` on a production branch or immediately before `caffeine preview`. This prevents accidental production canister calls during local development.

---

## 6. Before You Go Live Checklist

- [ ] `MOCK_MODE` is set to `false` in `src/frontend/src/lib/backend.ts`
- [ ] `src/frontend/public/.well-known/ic-domains` contains your real domain (not `yourdomain.com`)
- [ ] `caffeine build` completes with no errors
- [ ] `caffeine preview` completes and `env.json` is populated with real canister IDs
- [ ] DNS CNAME records are set at your registrar
- [ ] Domain registration `curl` command has been run and status is `Available`
- [ ] Stripe secret key and allowed countries are configured via the admin panel
- [ ] At least one product has a real PDF URL uploaded via the admin panel
- [ ] Admin user(s) have been added via the admin panel or are already the canister controller

---

## Reference Links

- [ICP Custom Domains — official docs](https://internetcomputer.org/docs/current/developer-docs/web-apps/custom-domains/using-custom-domains)
- [ICP DNS Setup Guide](https://internetcomputer.org/docs/current/developer-docs/web-apps/custom-domains/dns-setup)
- [Internet Identity](https://identity.ic0.app)
- [Deploying your first dApp on ICP (intro walkthrough)](https://medium.com/@chiedo/6-steps-to-deploying-your-first-dapp-on-the-internet-computer-b9a36b45f91e)
- [Caffeine platform](https://caffeine.ai)
