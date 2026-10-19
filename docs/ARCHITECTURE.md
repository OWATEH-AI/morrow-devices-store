# Architecture and Readiness

## Current request path

The App Router pages call `getPublishedProducts()` on the server. With Sanity project settings present, the reader fetches the published `product` projection from the Content Lake CDN and builds image URLs with `@sanity/image-url`. Without project settings, routes render explicitly labelled local demonstration products. A failed configured Sanity request is allowed to surface to the storefront error boundary; it is not masked by demo data.

The shared `Product` and `ProductVariant` types cover `phone`, `tablet`, `laptop`, and `accessory`. Collections are filters over that common type. Browser interactions own the current search/filter/sort state and a localStorage cart. Variant IDs/SKUs and integer paise values are retained in local state.

## Data boundaries

| Data                                                                                       | Intended system                                                 | Current state                                                                          |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Product descriptions, brand/category references, images, variant SKUs and catalogue prices | Sanity                                                          | Schemas and published read path included; needs a real project and published documents |
| Store identity and public policy copy                                                      | Sanity `storeSettings` plus `lib/store-config.ts` demo defaults | Schema/defaults included; live settings query and editing UI not wired                 |
| Cart selection                                                                             | Browser localStorage                                            | Working convenience only; not trusted for stock or price                               |
| Orders, immutable item snapshots, fulfillment/payment states                               | Neon PostgreSQL                                                 | SQL migration blueprint only; no connection or route implemented                       |
| Inventory ledger and adjustments                                                           | Neon PostgreSQL                                                 | Table blueprint only; no stock workflow implemented                                    |
| Owner identities, sessions, authorization, audit log                                       | Dedicated auth/session design plus database audit trail         | Not configured; `/admin` remains closed                                                |
| Payment provider references/webhooks                                                       | Selected provider and verified server endpoints                 | Not implemented; no payments are collected                                             |

## Order and inventory design intent

`migrations/0001_commerce.sql` stores monetary values as integer paise, snapshots product title/SKU/variant/price into `order_items`, tracks order state changes, gives checkout an idempotency key, and models inventory as on-hand/reserved values plus append-only movements. The eventual order endpoint must obtain product/variant prices server-side, use a single transaction, conditionally reserve stock, and reject invalid state transitions. The browser cart is never authoritative. Reservations, expiry, refunds, and payment reconciliation need explicit implementation before activation.

## Cloudflare

The generated C3 project uses vinext and produces a Worker bundle through Vite. Cloudflare Pages is not the selected target because this app needs server-side Sanity reads and future protected commerce endpoints. Pages remains a possible target only for a fully static export. This repository build was run locally; no Cloudflare account deployment or runtime-binding test has been performed.

## Data isolation

This codebase is a single-store template. A production client rollout should provision distinct Sanity project/dataset, database, secrets, authentication configuration, and deployment for every retailer. There is no tenant authorization boundary in the current code and it must not be presented as multi-tenant software today.
