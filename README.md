# Morrow Devices

A reusable, mobile-first demo storefront for independent electronics retailers. Phones, tablets, laptops, and accessories share one catalogue, collection, search, product-detail, and cart architecture.

> **Demo status:** Catalogue examples and remote images are illustrative. The browser cart is temporary. Checkout only previews a form and does not submit, persist, or charge an order. The admin route is closed until real authentication is configured. There is no Medusa dependency.

## Stack

- React, TypeScript, App Router-compatible routes, and Tailwind CSS utilities.
- Cloudflare Workers with Cloudflare's current vinext Next.js path. This is not a Pages deployment.
- Sanity Studio and published product reads.
- Neon PostgreSQL migration blueprint for future transactional commerce.
- Lucide icons.

Cloudflare currently recommends vinext for full-stack Next.js-style applications on Workers. Static Next.js exports can use Pages, but server-side catalogue reads and future protected operations need a Workers runtime. This project has not been deployed to Cloudflare.

## Local setup

Prerequisites: Node.js 22 and npm.

```powershell
cd mobile-store
npm install
Copy-Item .env.example .env.local
npm run dev
```

The storefront runs at `http://localhost:5173`. Without Sanity credentials it uses the labelled local sample catalogue. All displayed demo prices are examples, not offers or verified retailer prices.

Useful commands:

```powershell
npm run build
npm run typecheck
npm run start
npm run studio:dev
npm run studio:build
npm run studio:deploy
npm run deploy
```

`npm run start` previews the built Worker locally. `npm run deploy` requires Cloudflare authentication and deploys a Worker; it has not been run in this workspace.

## Sanity setup

1. Create a Sanity project and a `production` dataset in Sanity Manage.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and the pinned API version in `.env.local`.
3. For a public dataset, published products can be read through Sanity's CDN without a token. For a private dataset, create a read-only API token and set `SANITY_API_READ_TOKEN`. That variable is server-only and must not be renamed with a `NEXT_PUBLIC_` prefix.
4. Set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`, then run `npm run studio:dev` and sign in with Sanity.
5. Add `http://localhost:5173` and the production storefront URL to the project's CORS origins if needed.
6. Create/publish a brand, collection, and product. Products require a main image and at least one variant with SKU and integer `pricePaise`.

The Studio schemas are in `sanity/schemaTypes`. The frontend query explicitly reads published products and uses Sanity's image URL builder. If no Sanity project is configured, local demo products are shown. If a configured project fails, the storefront displays an error rather than silently substituting samples.

## Environment variables

See `.env.example`. Public project ID, dataset, API version, and site URL are not credentials. `SANITY_API_READ_TOKEN`, `DATABASE_URL`, and `SESSION_SECRET` are private and must only be configured in local secrets or the deployment provider. The database and session variables are reserved and are not yet consumed by application code.

## Commerce and security status

- Product variants carry SKU and integer paise prices; the UI updates the selected price.
- Cart contents persist in this browser only. They are not a reservation or stock record.
- Checkout is an input-validation and summary preview. It does not create orders or transmit personal details.
- Cash-on-delivery, pickup, WhatsApp, payment, refunds, tracking, customer accounts, and stock allocation are not active.
- `/admin` is an explicit setup gate, not a login page. No editing endpoints are exposed.
- No Sanity write token, database URL, payment secret, or session secret is included in browser code.
- The SQL file is a schema blueprint only; no database driver, migration runner, connection, or order API is installed.

## Deployment

This application is configured for **Cloudflare Workers**, not Cloudflare Pages: its server-rendered routes require a Worker runtime. The GitHub workflow at `.github/workflows/deploy.yml` checks pull requests and deploys verified pushes to `main`.

1. Create a Cloudflare API token with the permissions needed to deploy Workers, and note the Cloudflare account ID.
2. Push this project to the root of a GitHub repository using the `main` branch.
3. In that repository, open **Settings → Secrets and variables → Actions** and add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets. Never commit these values or paste them into chat.
4. Set Cloudflare's Git-connected build **deploy command** to `npm run deploy` (not `npx wrangler deploy`): this project builds Cloudflare Build Output for the `cf` CLI, and Wrangler cannot deploy that output. The repository script runs `cf deploy --prebuilt`.
5. Alternatively, push to `main` or run **Actions → Verify and deploy storefront → Run workflow**. GitHub Actions type-checks, builds, then deploys the prebuilt output with the same `cf` command. Cloudflare reports the public `workers.dev` URL after a successful deploy; ensure the `workers.dev` subdomain is enabled for the account.
6. Without Sanity project settings, the deployment uses the clearly labelled local demo catalogue. To show a real Sanity catalogue, add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` as repository variables. Keep `SANITY_API_READ_TOKEN` private and only set it as a GitHub Actions secret if the dataset is private.
7. Replace demo content, configure the production domain, and verify images, routes, and errors before sharing with clients.

Vercel is not configured by this repository's current Cloudflare-specific Vite/Worker setup. Choose a hosting target before deployment; do not configure the Cloudflare Worker workflow as a Vercel deployment.

Do not deploy this demo as a production shop until server-verified checkout, transactional order persistence, inventory policy, owner authentication/authorization, privacy/legal content, and fulfillment behavior have been implemented and tested.

## New retailer onboarding

Create a separate Sanity project/dataset and separate production database for each retailer. Set the retailer's logo, store name, accent, contact information, policies, catalogue, domain, and deployment secrets. Confirm image rights, prices, stock, warranty and delivery policies with the retailer. Keep customer/order data isolated; this template does not implement multi-tenancy.

## Known limits

- The demo catalogue includes phones, tablets, laptops, and one accessory; sample prices and product images are not live retailer data.
- The interface uses remotely hosted Unsplash photographs for the visual demo; replace them with retailer-approved product imagery before launch.
- No Neon connection, authenticated dashboard, payment gateway, real order flow, order tracking, legal pages, analytics, or production verification is configured.
- The generated Cloudflare target is Workers, not Cloudflare Pages. Full-stack Next.js on Pages is not the current recommended path.
- Free-plan quotas vary by provider and can change. Confirm current Sanity, Neon, and Cloudflare limits before customer use; production commerce may require paid plans.
