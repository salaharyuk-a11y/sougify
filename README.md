# Scarpar

Scarpar is a multi-tenant, module-based CMS, commerce, and business-management platform. One
deployment serves many independent organizations, each toggling the modules it needs and picking a
vertical preset — ecommerce, courses, services, or real estate — instead of forking the codebase per
business type.

It's built specifically for Bangladeshi businesses: cash-on-delivery and manual bKash/Nagad
verification as first-class payment paths, district-based delivery zones with local courier support
(Steadfast, Pathao), Mushak 6.3-compliant invoices for VAT-registered sellers, and Bangla-ready
storefront copy — the parts a generic Shopify/Medusa-style platform doesn't handle out of the box.

## Feature highlights

- **Commerce** — products, variants, categories, discounts, a full order lifecycle with returns, and
  an in-store POS terminal, all sharing one order-creation core.
- **Local delivery & COD** — delivery zones, rider assignment with OTP-confirmed handoff, COD
  settlement batches, courier adapters (manual today; Steadfast/Pathao real-shaped and config-gated),
  and public order tracking.
- **Receipts & printing** — A4 invoices (with a Mushak 6.3 variant), 80mm thermal receipts, and 4x6
  courier labels with a hand-rolled Code128 barcode — browser print, no PDF service required.
- **CMS & storefront** — an 11-block page builder (hero, rich text, product grid, banners, FAQ,
  testimonials, and more) with drafts, publish, and revision history, plus a fast storefront with
  cart, checkout, and order confirmation.
- **Business ops** — expense tracking, sales/delivery/financial reports with CSV export (including a
  Mushak 6.2 register), an audit log, and a settings engine covering ~30 org-level toggles.
- **Multi-vertical modularity** — the same admin shell serves ecommerce, online courses, service
  businesses, and real-estate listings by swapping which modules are enabled.
- **Multi-tenancy & roles** — org-scoped data with Postgres RLS on every table, and a five-level role
  hierarchy (owner/admin/manager/staff/rider/viewer) plus a separate platform-admin tier.

## Tech stack

Next.js 15 (App Router, TypeScript, RSC) + Supabase (Postgres, Auth, Storage, RLS) + Tailwind v4.

## Quickstart

1. **Prerequisites**: Node 20+.
2. `npm install`
3. Create a Supabase project, then apply the schema — SQL Editor → paste and run, in order:
   `supabase/migrations/0001_core.sql` → `0002_commerce.sql` → `0003_delivery_cms_ops.sql` →
   `0004_storefront_public_org_read.sql` (or `supabase db push` via the CLI).
4. Optional demo data — same approach, in order: `supabase/seed/01_core.sql` → `02_commerce.sql` →
   `03_delivery_cms.sql`. Creates a demo org (slug `demo`); see the file's tail comment to link your own
   account as its owner.
5. `cp .env.example .env.local` and fill in your Supabase project URL, anon key, and service role key.
6. `npm run dev`
7. Sign up at `/signup`, then complete the `/onboarding` wizard to create your organization.

## URL patterns

- Public storefront: `/s/[org-slug]`
- Delivery tracking: `/track/[code]`

## Project structure

```
src/app/          routes: (auth), onboarding, (admin)/admin, (store)/s/[org], (print)/print, track, api
src/modules/      one folder per module — module.config.ts + actions.ts + schemas.ts + components/
src/lib/          supabase clients, settings engine, money/audit/notify, couriers/, barcode/
src/components/ui shared component primitives
supabase/migrations   0001-0004, apply in order
supabase/seed         01-03, optional demo data (org slug "demo")
docs/             architecture.md, conventions.md, design-system.md, deployment.md (binding contracts)
```

## Docs

- `docs/architecture.md` — binding architecture contract.
- `docs/conventions.md` — binding build conventions.
- `docs/design-system.md` — design tokens and aesthetic.
- `docs/deployment.md` — Vercel + Supabase deploy steps.
- `docs/saas-roadmap.md` — template → commercial SaaS conversion plan (phased, effort-tagged).
- `docs/operations.md` — production runbook (migrations, tenant lifecycle, backups, incidents).
- `docs/extending.md` — developer guide: codebase tour + recipes for modules/blocks/verticals/adapters.
- `.memory/` — shared project memory: context, feature list, next steps, decisions, build log.

## License

Proprietary — Elite Heights.
