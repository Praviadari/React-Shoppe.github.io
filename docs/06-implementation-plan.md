# GiftShoppe — World-Class Implementation Plan

**Based on:** Audit reports `01`–`05` in `docs/`  
**Created:** June 28, 2026  
**Status:** Phase 12 complete

### New `src/` layout (Phase 1–3)

```
src/
├── app/routes.js
├── components/
│   ├── auth/              # ProtectedRoute
│   ├── layout/
│   ├── product/
│   └── ui/
├── context/
│   ├── AuthContext.js
│   ├── CartContext.js
│   └── WishlistContext.js
├── hooks/useProducts.js
├── pages/                 # + Login, SignUp, Account, Wishlist
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── wishlistService.js
│   ├── productService.js
│   └── orderService.js
├── utils/                 # productHelpers, authErrors, formatPrice
└── styles/                # pages.css, auth.css, animations.css
```

---

## North Star

GiftShoppe should feel like a **luxury gifting concierge online** — curated catalog, bespoke custom builds, frictionless checkout, trustworthy delivery, and accessible on every device.

### Success criteria (12-month target)

| Dimension | Target |
|-----------|--------|
| **Commerce** | Real cart → checkout → payment → order confirmation |
| **Performance** | LCP < 2.5s, CLS < 0.1 on Shop and Home |
| **Accessibility** | WCAG 2.2 AA on core flows |
| **Security** | No plaintext auth, env-based secrets, deployed Firestore rules |
| **Quality** | 70%+ unit coverage on business logic, green CI on every PR |
| **SEO** | Indexable product/collection pages with structured data |
| **UX** | Zero dead nav links; mobile cart always reachable |

---

## Strategic decisions

| Decision | Recommendation |
|----------|----------------|
| Canonical app | `gift-shoppe/` is the only app |
| Frontend | Vite + React 18 (migrate from CRA when stable) |
| Backend | Firebase Auth + Firestore + Functions |
| Payments | Razorpay (INR-first) |
| State | React Context + hooks |
| Styling | Tailwind + CSS variables (single system) |
| Legacy code | Remove root `server.js`, `public/js/` |

---

## Phase 0 — Foundation (Week 1–2) ✅

- [x] Save implementation plan
- [x] Remove legacy `server.js` and `public/js/` login scripts
- [x] Fix `.gitignore` (root + gift-shoppe)
- [x] Restore `react-scripts` in `package.json`; remove OpenSSL legacy flag
- [x] Add `.env.example`, `.nvmrc`
- [x] `NotFoundPage` + catch-all route
- [x] `ComingSoonPage` for planned routes (account, checkout, etc.)
- [x] `CartContext` + `/cart` page wired to Header, ProductCard, CustomGiftBuilder
- [x] GitHub Actions CI (test + build)
- [x] Root `README.md` pointing to `gift-shoppe/`
- [ ] Flatten nested git repo / consolidate root vs gift-shoppe (manual if nested `.git` exists)
- [x] `build/` in `.gitignore` (not committed)

## Phase 1 — Architecture (Week 3–4) ✅

- [x] Reorganize `src/` into `pages/`, `components/`, `context/`, `services/`, `styles/`
- [x] Upgrade react-router-dom v6
- [x] Lazy-load routes with `Suspense` + `PageLoader`
- [x] Remove duplicate CustomGiftBuilder from Home (CTA banner → `/build`)
- [x] Extract shared `animations.css`; scope Shop sidebar styles
- [x] Firebase config moved to `services/firebase.js` (env-based)

## Phase 2 — Core commerce (Week 5–8) ✅

- [x] `productService` — Firestore catalog with static `data/products.js` fallback
- [x] `useProducts` hook wired on Home, Shop, Collections
- [x] Product detail pages `/shop/:slug` with related products
- [x] `ProductCard` links to detail pages; slugs via `productHelpers`
- [x] Full cart + `/cart` page with checkout CTA
- [x] `/checkout` — delivery form, validation, order placement
- [x] `/order/:orderId` — order confirmation page
- [x] `orderService` — localStorage orders (+ optional Firestore when auth exists)
- [x] Custom build adds line items to cart (BuildPage)
- [x] Razorpay checkout integration (client-side; set `REACT_APP_RAZORPAY_KEY_ID`)
- [x] Server-side payment signature verification via Cloud Functions
- [x] Server-side cart and custom build price validation via Cloud Functions

## Phase 3 — Auth & accounts (Week 9–10) ✅

- [x] Firebase Auth — email/password sign-up and sign-in via `authService`
- [x] `AuthContext` + `AuthProvider` with profile loading
- [x] `/login`, `/signup` pages with env-aware unavailable state
- [x] `/account` dashboard (protected) — profile, delivery defaults, order history
- [x] `userService` — Firestore user profiles
- [x] `WishlistContext` — localStorage for guests, Firestore sync when signed in
- [x] `/wishlist` page + heart toggle on ProductCard and ProductDetailPage
- [x] Orders linked to `userId` when authenticated; `getOrdersForUser` queries Firestore
- [x] Checkout pre-fills delivery details from saved profile
- [x] Firestore rules updated for `users/{userId}/wishlist/{productId}`
- [x] Firestore rules for `inquiries` collection + `firebase.json` deploy config
- [ ] Deploy Firestore rules to production Firebase project (`npm run deploy:rules`)
- [x] Google sign-in via Firebase Auth popup
- [ ] OAuth providers (Apple) — future enhancement

## Phase 4 — UX, A11y & performance (Week 11–13) ✅

- [x] Skip-to-main-content link + global `:focus-visible` styles
- [x] WCAG AA text contrast — `--color-text-secondary` darkened to `#595959`
- [x] Mobile nav — backdrop, Escape to close, focus trap, body scroll lock
- [x] Cart + wishlist visible on mobile; non-functional currency chevron removed
- [x] `ProductGridSkeleton` + progressive loading (hero visible while products load)
- [x] `EmptyState` component — cart, wishlist, shop filters, catalog errors
- [x] `ProductImage` — lazy load, `decoding="async"`, error placeholder
- [x] `useProducts` reload for error recovery
- [x] Build page live preview announced via `aria-live`
- [x] `prefers-reduced-motion` support expanded
- [x] Duplicate Google Fonts `@import` removed from `index.css`
- [x] Web Vitals logged in development
- [x] Web manifest updated with app name
- [x] Self-host hero promo image (local product asset, no Unsplash)
- [x] WebP image pipeline — `generate-webp.js` + `<picture>` in `ProductImage`
- [x] LCP preload for first featured product on Home
- [x] `fetchpriority="high"` on above-the-fold product cards

## Phase 5 — SEO & growth (Week 14–16) ✅

- [x] `react-helmet-async` + `SeoHead` component for per-route meta tags
- [x] Open Graph + Twitter Card tags on all public pages
- [x] Canonical URLs via `REACT_APP_SITE_URL`
- [x] JSON-LD: Organization, WebSite, Product, BreadcrumbList, ItemList
- [x] `scripts/generate-sitemap.js` — builds `public/sitemap.xml` + `robots.txt` on prebuild
- [x] Collections editorial content + category product grids
- [x] About page expanded with values section
- [x] Private flows (cart, checkout, account) marked `noindex`
- [x] Static HTML prerender for public routes + product pages (`scripts/prerender-static.js`)
- [x] Per-product OG images via prerender + existing `SeoHead` on product detail
- [ ] Dynamic OG image generation service

## Phase 6 — Quality & DevOps (ongoing) ✅

- [x] Cypress installed with `cypress/support` helpers
- [x] E2E specs rewritten for real commerce flows (`commerce`, `edge`, `security`)
- [x] `cy:ci` script + GitHub Actions E2E job (serve build + Cypress)
- [x] Jest coverage thresholds for `src/utils/` and `orderService`
- [x] New unit tests: `formatPrice`, `orderService`
- [x] `setupTests.js` for shared test setup
- [x] Optional Sentry hook via `REACT_APP_SENTRY_DSN` + `ErrorBoundary` reporting (install `@sentry/react` for full SDK)
- [x] CI uploads `lcov.info` coverage artifact
- [x] Cypress + axe-core accessibility checks (`cypress/e2e/a11y.cy.js`)
- [x] CI a11y job on core routes
- [ ] Raise global coverage toward 70% target

## Phase 7 — Premium differentiators (Week 17+) ✅

- [x] `/concierge` — gift recommendation request form with `inquiryService`
- [x] `/corporate` — bulk corporate gifting inquiry form
- [x] Scheduled delivery date on checkout + order confirmation
- [x] `/admin` dashboard — orders, concierge, and corporate inquiries (admin email allowlist)
- [x] `AdminRoute` + `REACT_APP_ADMIN_EMAILS` env config
- [x] Footer and home page links to premium services
- [x] Sitemap entries for `/concierge` and `/corporate`
- [ ] Gift concierge live chat / CRM integration
- [ ] Multi-address corporate fulfillment workflow
- [ ] Server-backed admin with role-based Firebase custom claims

## Phase 8 — Payments & support (Week 18+) ✅

- [x] `paymentService` — Razorpay Checkout.js loader + payment modal
- [x] Checkout flow — pay via Razorpay when key is configured; simulated orders otherwise
- [x] Order payment metadata (`paymentStatus`, `paymentId`, `paymentProvider`)
- [x] `/faq` — frequently asked questions
- [x] `/shipping` — shipping rates, timelines, returns policy
- [x] `/contact` — support contact form via `inquiryService`
- [x] `/track-order` — order lookup by reference (supports `?id=ORD-...`)
- [x] `/privacy` and `/terms` — legal content pages
- [x] Google OAuth sign-in on login and signup pages
- [x] Sitemap entries for new public support pages
- [x] Client-side Razorpay checkout when Cloud Functions are disabled
- [ ] Live support chat integration

## Phase 10 — Cloud Functions backend ✅

- [x] `functions/` — Firebase Cloud Functions (Node 20, `asia-south1`)
- [x] `validateCartPricing` — server-side catalog + custom build price checks
- [x] `createRazorpayOrder` — Razorpay order creation with secret key
- [x] `verifyRazorpayPayment` — HMAC signature verification
- [x] `src/utils/customBuildPricing.js` — shared pricing logic (Build page + validation)
- [x] `src/utils/cartValidation.js` — client-side fallback validation
- [x] `scripts/generate-catalog-prices.js` — sync catalog prices to `functions/data/`
- [x] `functionsService.js` — callable wrappers + `REACT_APP_USE_CLOUD_FUNCTIONS` flag
- [x] Checkout validates cart before payment; server Razorpay flow when functions enabled
- [x] `npm run deploy:functions` + `npm run sync:catalog-prices`
- [ ] Deploy functions to production Firebase project
- [ ] Firebase Functions emulator in CI

## Phase 9 — Discoverability & platform hardening ✅

- [x] `/search` — client-side catalog search with `?q=` URL param
- [x] `searchProducts` utility + unit tests
- [x] `/support` — support hub linking FAQ, contact, track, concierge, corporate
- [x] `/careers`, `/press`, `/sustainability` — company content pages
- [x] All footer and header nav links now resolve to real pages (zero coming-soon stubs)
- [x] `EmptyState` `secondaryTo` link support
- [x] Hero promo uses self-hosted product image (`/img/Products/f3.jpg`)
- [x] `firebase.json` + `npm run deploy:rules` for Firestore rules deployment
- [x] Firestore rules for `inquiries` writes
- [x] Root repository `README.md`
- [x] Site-wide search analytics (localStorage + admin view)

## Phase 11 — Performance & accessibility quality ✅

- [x] `scripts/generate-webp.js` — JPEG → WebP conversion via `sharp` (runs on build)
- [x] `imageSources.js` — WebP path resolution + public URL helpers
- [x] `ProductImage` — `<picture>` with WebP source, `sizes`, `fetchpriority`
- [x] Home page LCP preload via `react-helmet-async`
- [x] Priority loading for first two featured products
- [x] `cypress-axe` + `a11y.cy.js` — WCAG 2.x checks on core routes
- [x] CI runs accessibility spec with Cypress E2E job
- [x] Unit tests: `imageSources`, `ProductImage`, `functionsService`
- [x] Lighthouse CI budget enforcement (`lighthouserc.js`)
- [ ] Visual regression testing

## Phase 12 — SEO prerender & quality gates ✅

- [x] `scripts/prerender-static.js` — post-build static HTML for crawlers (meta, JSON-LD, noscript content)
- [x] Prerenders static pages + all product `/shop/:slug` routes
- [x] `searchAnalytics` service — local search term tracking on `/search`
- [x] Admin dashboard shows popular search terms
- [x] Lighthouse CI (`lighthouserc.js`) with performance, a11y, SEO budgets
- [x] CI runs Lighthouse after production build
- [x] Unit tests for `searchAnalytics`
- [ ] Full SSR framework migration (Vite/React Router SSR)
- [ ] Search analytics sync to Firestore

---

## Tech stack (target)

```
Frontend:  Vite + React 18 + React Router 6 + Tailwind
Backend:   Firebase (Auth, Firestore, Storage, Functions)
Payments:  Razorpay
CI/CD:     GitHub Actions → Firebase Hosting / gh-pages
```

---

## Immediate action list (this sprint)

1. Delete legacy `server.js` and `public/js/`
2. Fix `package.json` — restore build toolchain
3. Add `NotFoundPage` + honest navigation
4. Implement `CartContext` with localStorage
5. GitHub Actions CI
6. `.env.example` for Firebase keys

See audit reports for detailed findings driving each phase.
