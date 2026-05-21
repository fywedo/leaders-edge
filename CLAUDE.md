# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Frontend** (run from `src/frontend/`):
```
pnpm install --prefer-offline   # install deps
pnpm dev                        # start Vite dev server (proxies /api → localhost:8080)
pnpm build                      # production build → dist/
pnpm typecheck                  # TypeScript type check (no emit)
pnpm check                      # Biome lint check
pnpm fix                        # Biome lint auto-fix
```

**PHP API** (run from project root for local dev):
```
php -S localhost:8080 -t api/   # serve PHP API locally (requires .env at root)
composer install                # install PHP deps (stripe, phpmailer, jwt, dotenv)
```

**Full local dev**: run both `pnpm dev` (in `src/frontend/`) and `php -S localhost:8080 -t api/` (at root) simultaneously. Vite proxies `/api/*` calls to the PHP server.

## Architecture

This is a **React + PHP + MySQL** app hosted on Namecheap shared hosting. It sells digital products (PDFs) with Stripe payments.

### Backend (`api/` — PHP 8.2)

Flat PHP files, each handling one resource. No framework — just a router via file structure:

| File | Responsibility |
|------|----------------|
| `api/config.php` | Loads `.env`, defines constants |
| `api/db.php` | PDO MySQL connection + `query()`, `jsonOk()`, `jsonError()` helpers |
| `api/middleware.php` | `requireAuth()` / `isAuthed()` — validates Bearer JWT |
| `api/auth.php` | `POST` login → JWT (8h session) |
| `api/products.php` | `GET` (public, active only) · `GET ?admin=1` (all, auth) · `POST` upsert (auth) |
| `api/faqs.php` | `GET` (public) · `POST` upsert (auth) · `DELETE ?id=` (auth) |
| `api/leads.php` | `GET` all leads (auth) |
| `api/checkout.php` | `POST` → Stripe Checkout session · `GET ?session_id=` → verify + return download token |
| `api/webhook.php` | Stripe webhook receiver → saves lead + sends email + generates download token |
| `api/download.php` | `GET ?token=` → streams PDF from `pdfs_private/` after token check |
| `api/upload.php` | `POST` multipart PDF upload (auth) → saves to `pdfs_private/` |

**Configuration:** all secrets live in `.env` at project root (never committed). See `.env.example`.

**Database:** MySQL. Run `schema.sql` once via cPanel → phpMyAdmin after creating the database.

**PDF storage:** files saved to `pdfs_private/` (inside `public_html/` but blocked by `.htaccess deny from all`). Served only via `download.php` after token validation. Tokens expire 48 hours after purchase.

**Admin auth:** single admin, credentials in `.env` (`ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH` bcrypt). JWT issued on login, stored in `localStorage`.

**Stripe flow:**
1. Frontend POSTs to `/api/checkout.php` → gets Stripe Checkout URL → redirects customer
2. On payment: Stripe calls `/api/webhook.php` → lead saved, download token generated, email sent
3. Success page calls `GET /api/checkout.php?session_id=xxx` → returns token → shows download button
4. Customer clicks download → `GET /api/download.php?token=xxx` → PHP streams PDF

### Frontend (`src/frontend/` — React + TypeScript)

- **React 19** + **TanStack Router** (routes: `/`, `/checkout`, `/success`, `/admin`)
- **TanStack Query** for all data fetching
- **Tailwind CSS** + **shadcn/ui** components (Radix primitives in `src/components/ui/`)
- **Biome** for linting/formatting (not ESLint/Prettier)

**API layer:**
- `src/lib/api.ts` — all `fetch()` calls to `/api/*.php` endpoints; `getAdminToken()` / `clearAdminToken()` for JWT lifecycle
- `src/hooks/useProducts.ts`, `useFAQs.ts`, `useAdmin.ts` — TanStack Query wrappers around `api.*`

**Admin auth:** `Admin.tsx` renders a username/password form when no JWT is in `localStorage`. After login, JWT is stored and passed as `Authorization: Bearer <token>` on all admin API calls.

**Facebook Pixel:** configured via `VITE_FB_PIXEL_ID` environment variable (set as GitHub Actions secret). Baked into the build — changing it requires a redeploy.

### Design System

See `DESIGN.md` for the full visual spec. Key constraints:
- Color palette: deep navy background (`oklch(0.16 0.04 232)`), warm gold primary (`oklch(0.72 0.18 52)`)
- Typography: Fraunces (serif) for display/headings, General Sans for body
- No gradients, no animated backgrounds — gold used only as accents
- Buttons: gold background + dark navy text; cards: gold 2px top border on navy

### Deployment

- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) — builds frontend + installs Composer deps + FTP uploads to Namecheap `public_html/`
- **Required GitHub secrets:** `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `VITE_FB_PIXEL_ID`
- **`.env` file:** uploaded manually to the server once via FTP/SSH — never deployed by CI
- **Database:** provisioned once via cPanel → MySQL Databases; run `schema.sql` via phpMyAdmin
- See `DEPLOY.md` for the full step-by-step guide

### Old Motoko backend (`src/backend/`)

The original ICP/Caffeine Motoko backend is kept for reference but is not used. The live backend is now the PHP API in `api/`.
