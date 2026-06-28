# GiftShoppe — World-Class Implementation Plan

**Based on:** Audit reports `01`–`05` in `docs/`  
**Created:** June 28, 2026  
**Status:** Phase 5 complete — Phase 6 next

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
- [ ] Flatten nested git repo / consolidate root vs gift-shoppe
- [ ] Remove committed `build/` artifacts from disk

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
- [ ] Razorpay payment integration (deferred to Phase 3+)
- [ ] Server-side price validation for custom builds (requires Cloud Functions)

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
- [ ] Deploy Firestore rules to production Firebase project
- [ ] OAuth providers (Google, Apple) — future enhancement

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
- [ ] Compress product images / WebP conversion (asset pipeline)
- [ ] Self-host hero promo image (remove Unsplash dependency)

## Phase 5 — SEO & growth (Week 14–16) ✅

- [x] `react-helmet-async` + `SeoHead` component for per-route meta tags
- [x] Open Graph + Twitter Card tags on all public pages
- [x] Canonical URLs via `REACT_APP_SITE_URL`
- [x] JSON-LD: Organization, WebSite, Product, BreadcrumbList, ItemList
- [x] `scripts/generate-sitemap.js` — builds `public/sitemap.xml` + `robots.txt` on prebuild
- [x] Collections editorial content + category product grids
- [x] About page expanded with values section
- [x] Private flows (cart, checkout, account) marked `noindex`
- [ ] Prerender/SSR for crawlers that do not execute JavaScript
- [ ] Per-route OG images for all products (dynamic image generation)

## Phase 6 — Quality & DevOps (ongoing)

- Rewrite Cypress, coverage targets, Sentry

## Phase 7 — Premium differentiators (Week 17+)

- Gift concierge, scheduled delivery, corporate gifting, admin dashboard

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
