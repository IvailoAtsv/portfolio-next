# Sellphy case study evidence

Prepared 2026-09-03 for `src/pages/work/sellphy.astro`. Updated the same day with author-supplied captures and the hosting-cost outcome.

## Ownership and scope

`PRODUCT.md` identifies the project as the multi-tenant shop and public website platform in `/Users/Ivajlo/Documents/GitHub/Cu-store`. The case is product design and full-stack implementation.

The author supplied two outcomes: an 83% hosting-cost drop after making public shop pages statically generated and moving off Vercel onto a Hetzner VPS, and 25+ hours of maintenance saved per month after moving all of the author's shops onto Sellphy. Dashboard figures in screenshots remain demo data and are labeled as such. No public project link is supplied for Sellphy: `sellphy.app` is Keep Up. Production domain in the Cu-store deploy docs is `sellphy.store`.

## Captures

User-supplied screenshots from 2026-09-03, encoded as WebP (quality 88) at native 1024px width. Each WebP has an adjacent JSON provenance sidecar. Older 1800px captures remain on disk unused by the page.

| Portfolio asset                                       | Source                                        |
| ----------------------------------------------------- | --------------------------------------------- |
| `public/assets/projects/sellphy/builder.webp`         | Site editor, step 2 of 6, video hero          |
| `public/assets/projects/sellphy/product-demo.webp`    | DEMO apparel product page                     |
| `public/assets/projects/sellphy/product-alcona.webp`  | Alcona fence product page with calculator CTA |
| `public/assets/projects/sellphy/product-gymleco.webp` | Gymleco dark product page                     |
| `public/assets/projects/sellphy/products.webp`        | Products table                                |
| `public/assets/projects/sellphy/seo-preview.webp`     | Page Preview / SEO inspector                  |
| `public/assets/projects/sellphy/analytics.webp`       | Analytics dashboard                           |
| `public/assets/projects/sellphy/analytics-tour.webp`  | Analytics with tour step 4 of 10              |

## Verified implementation details

- Stack: Cu-store `package.json` declares Next.js, React, TypeScript, Mongoose/MongoDB. Production deploy docs: Docker on a Hetzner VPS with Caddy, cut over from Vercel.
- Static storefronts: `app/s/[shopSlug]/page.tsx`, `shop/page.tsx`, `category/[categorySlug]/page.tsx`, `about/page.tsx`, `services/page.tsx`, and `legal/[policySlug]/page.tsx` export `dynamic = "force-static"`. Cart, checkout, and the dashboard remain `force-dynamic`.
- Revalidation: `lib/revalidate-shop-paths.ts` calls `revalidatePath` and `revalidateTag` for slug and custom-domain segments. Public shop loaders in `actions/public-shop.ts` wrap in `unstable_cache`.
- Category ISR: `lib/category-route-query.ts` and `proxy.ts` encode filter query strings into the internal path so filtered category URLs stay cacheable while the public URL stays readable. Redirect rules are evaluated in the proxy before ISR.
- Site editor: `app/dashboard/e-commerce/setup/SetupWizard.tsx` is six steps (layout, home, shop, navigation, colors, fonts). Live preview reuses public storefront components. Inline text editing is described in `setup-tour-config.ts`.
- Tours: 17 tour configs wired from `DashboardHeader.tsx`. First visit auto-starts; the header `?` replays. Completion is stored per shop (`models/Shop.ts` `tours`). Analytics tour is ten steps (`analytics-tour-config.ts`), including cookieless unique-visitor reset at midnight UTC.
- Page Preview: `app/dashboard/e-commerce/page-preview/page.tsx` renders `SeoPageInspector`, which draws a Google snippet, Open Graph / Twitter cards, character rulers, and an audit table.
- Product page: `app/dashboard/e-commerce/product-page` edits trust cards, gallery image fit, and quantity. `models/Shop.ts` `orderMode` is `order` or `request`; `requestLabels.preset` includes `request`, `inquiry`, `calculator`, `quote`, and `custom`. Live captures: DEMO apparel, Alcona (calculator CTA), Gymleco (dark theme).

## Verification boundary

Only read-only inspection was performed in Cu-store. No source changes, database access, production writes, deployment, or tests/builds were performed there.
