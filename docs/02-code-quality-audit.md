# React Shoppe — Code Quality & Bugs Audit

**Scope:** All 16 JS files in `gift-shoppe/src/`, plus root `server.js` and `firebase.js`  
**Stack:** React 18, react-router-dom v5, static product data, Express/Knex auth server (root, separate from React app)

---

## 1. Executive Summary

GiftShoppe is a polished static storefront with thoughtful XSS hardening in `CustomGiftBuilder`, a top-level `ErrorBoundary`, and reasonable component structure. However, it behaves more like a UI prototype than a working e-commerce app: **cart, wishlist, search, and account flows are not implemented**, yet the UI advertises them with hardcoded `₹0.00` and “Added to Cart” toasts that do not persist anything.

The most impactful issues are:

1. **16+ navigation links point to routes that do not exist** — users see a blank main area with no 404 page.
2. **`gift-shoppe` references `react-scripts` in npm scripts but does not declare it** — a clean `npm install && npm start` in `gift-shoppe/` is likely to fail.
3. **Root `server.js` is a separate legacy auth API** with plaintext passwords, fragile error handling, and no integration with the React app.
4. **React anti-patterns:** uncleared `setTimeout` in `ProductCard`, global CSS leakage from `Shop.js`, and mobile header hiding cart/search actions.
5. **Duplicate/dead Firebase config** at root vs `gift-shoppe/src/firebase.js` (neither is imported by the React app).

Overall risk: **moderate for a demo**, **high if treated as production-ready e-commerce or auth backend**.

---

## 2. Severity Breakdown

| Severity | Count | Description |
|----------|-------|-------------|
| **Critical** | 6 | Broken builds, security flaws, misleading core commerce behavior |
| **High** | 11 | Memory leaks, routing/CSS bugs, null crashes, mobile UX failures |
| **Medium** | 14 | Dead code, inconsistent packages, missing validation, accessibility gaps |
| **Low** | 9 | Duplication, cosmetic data issues, fragile tests, minor CSS ordering |

---

## 3. Detailed Findings

Sorted by severity (Critical → Low), then by file.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| **Critical** | `gift-shoppe/package.json:16-21` | Scripts call `react-scripts` but it is **not listed** in `dependencies` or `devDependencies`; absent from `package-lock.json`. | Add `react-scripts@5` as a dependency; verify `npm ci && npm start` on a clean machine. |
| **Critical** | `server.js:41-44,64-65` | Passwords stored and compared **in plaintext** in PostgreSQL. | Hash with bcrypt/argon2; never store or compare raw passwords. |
| **Critical** | `Header.js:57-60`, `ProductCard.js:7-12`, `CustomGiftBuilder.js:35-37` | **Cart is fake**: header shows `₹0.00`; “Add to Cart” only toggles local UI state/toast with **no cart context, persistence, or total update**. | Introduce cart state (Context/reducer + `localStorage`); wire header total and add-to-cart handlers to it. |
| **Critical** | `Header.js:14-58`, `Footer.js:20-50`, `App.js:17-32` | **16 routes linked in UI have no matching `<Route>`** (`/cart`, `/account`, `/wishlist`, `/search`, `/track-order`, `/support`, `/new`, `/careers`, `/press`, `/sustainability`, `/faq`, `/shipping`, `/contact`, `/track`, `/privacy`, `/terms`). | Add routes + placeholder pages, or remove/disable links; add a catch-all 404 `<Route>`. |
| **Critical** | `App.js:17-32` | No **404 / fallback route** in `<Switch>`. Unknown paths render empty `<main>`. | Add `<Route><NotFound /></Route>` as the last child of `<Switch>`. |
| **Critical** | `firebase.js:9-16`, `gift-shoppe/src/firebase.js:2-10` | Firebase API keys committed in source; config duplicated at root and in `gift-shoppe`. | Use env vars; restrict keys in Firebase console; consolidate to one module or remove if unused. |
| **High** | `server.js:38-39,50-54` | `name.length` / `email.length` / `password.length` on destructured fields **throws if fields are missing** (`undefined.length`). | Validate `req.body` explicitly; return 400 with a structured error. |
| **High** | `server.js:50-54` | Register `.catch` calls `err.detail.includes(...)` without guarding **`err.detail`** — non-unique-constraint errors can throw and leave the client hanging. | Use `err.code === '23505'` (Postgres) or check `err.detail?.includes`; always `res.status(500).json(...)`. |
| **High** | `server.js:58-74` | `/login-user` has **no `.catch()`** — DB failures produce unhandled rejections and no response. | Add `.catch(err => res.status(500).json({ error: '...' }))`. |
| **High** | `ProductCard.js:9-11` | `setTimeout` in click handler with **no cleanup on unmount** — can call `setIsAdded(false)` after unmount (React warning / minor leak). | Store timer id in `useRef`; clear in `useEffect` cleanup or use a mounted flag. |
| **High** | `Shop.js:118-123` | Inline `<style>` uses **global** `ul` and `li` selectors under `@media` — restyles footer lists and any other lists on the Shop page at ≤900px. | Scope selectors (e.g. `.shop-sidebar ul`, `.shop-sidebar li`). |
| **High** | `Header.css:125-127` | On mobile (`max-width: 900px`), **`.header-actions` is `display: none`** — cart, search, account, wishlist are unreachable. | Move actions into mobile nav or show a compact action bar. |
| **High** | `ProductCard.js:4,17-31` | No guard if `product` is `undefined` — **`product.image` throws** immediately. | Add PropTypes/TypeScript or early return; default `product` in tests only. |
| **High** | `package.json:23` (root) | Dependency is **`express.js`** (unofficial/wrong package name), not `express`. | Replace with `express`; audit what actually runs in production. |
| **High** | Root vs `gift-shoppe` | **Two separate apps**: root (`loginform`, RR v6, MUI, Firebase, Knex server) vs `gift-shoppe` (CRA-style, RR v5, no server). Names, routers, and deploy targets conflict. | Split repos or document one canonical app; align router version and deploy path. |
| **High** | `gift-shoppe/package.json` (missing `homepage`) | Root has `homepage` for GitHub Pages; **gift-shoppe has none** and uses `BrowserRouter` without `basename` — subpath deploys break client routing. | Set `homepage` + `<Router basename={...}>` if deploying to GH Pages. |
| **Medium** | `gift-shoppe/src/firebase.js:1-10` | **Dead code**: exports only `firebaseConfig`, never imported; does not call `initializeApp`. | Remove or wire up auth/analytics intentionally. |
| **Medium** | `firebase.js:1-21` (root) | ES module `import` at repo root; **not used** by `server.js` (CommonJS). Module system mismatch if combined. | Use one module format; import only where needed. |
| **Medium** | `index.js:21` | `reportWebVitals()` called **without a callback** — no-op (dead invocation). | Pass `console.log` or remove the call. |
| **Medium** | `ErrorBoundary.js:26` | UI says *“Our team has been notified”* but only **`console.error`** runs — misleading copy. | Integrate error reporting or change message to “Error logged locally.” |
| **Medium** | `ErrorBoundary.js:9-11` | `getDerivedStateFromError` ignores `error` param; first error render may show **empty `<details>`** until `componentDidCatch` runs. | Return `{ hasError: true, error }` from `getDerivedStateFromError` (error object is allowed in state for boundaries). |
| **Medium** | `ErrorBoundary.js` (usage) | Boundary wraps entire app in `index.js` only — **no per-route boundaries**; one error takes down all navigation until reload. | Optional nested boundaries around heavy widgets (`CustomGiftBuilder`, product grids). |
| **Medium** | `Header.js:14`, `Footer.js:36` | Inconsistent track-order paths: **`/track-order`** vs **`/track`**. | Standardize on one path. |
| **Medium** | `Home.js:55`, `App.js:21-23` | `CustomGiftBuilder` rendered **inline on Home** and again at `/build` — duplicate instances, separate state, inconsistent page chrome on `/build`. | Use a shared section component on Home; full-page layout only on `/build`, or link Home to `/build` instead of embedding. |
| **Medium** | `Collections.js:45` | `featuredProducts.slice(0, 8)` shows only **`Featured`** items (first 8 in array); **New Arrivals never appear** on Collections despite data including them. | Slice/filter by collection intent or rename page. |
| **Medium** | `App.js:21-31` | Routes lack `exact` (except `/`) — **`/shop/foo`, `/build/extra`** still match Shop/Build routes (v5 prefix matching). | Add `exact` where appropriate or use v6 `Routes`/`Route` API. |
| **Medium** | `Header.js:34` | Hamburger is a `<div onClick>` — **not keyboard-accessible**, no `aria-expanded` / `role="button"`. | Use `<button>` with ARIA attributes; trap focus in mobile menu. |
| **Medium** | `ProductCard.js:17` | Product images have **no `onError` fallback** or `loading="lazy"` — broken assets show broken icon; performance hit on large grids. | Add placeholder image and lazy loading. |
| **Medium** | `gift-shoppe/src/index.css:3-6` | `@import` for Google Fonts appears **after** `@tailwind base` — invalid ordering per CSS spec; may warn or fail in strict pipelines. | Move all `@import` to top of file. |
| **Medium** | `gift-shoppe/tailwind.config.js:5-17` | Tailwind `theme.colors` **replaces entire default palette**; no `postcss.config.js` in project. Tailwind may not process as expected without CRA/postcss wiring. | Restore `extend.colors` or verify built CSS; add PostCSS config if not using react-scripts defaults. |
| **Medium** | `gift-shoppe/package.json:22-23` | `cy:open` / `cy:run` scripts reference **Cypress with no Cypress dependency or tests**. | Remove scripts or add Cypress suite. |
| **Low** | `data/products.js:13,17` | Duplicate display name **“Creative Photo Frame”** (different ids `n4`, `n8`) — confusing in Shop listings. | Differentiate names or dedupe catalog. |
| **Low** | `Shop.js:113-124`, `Collections.js:52-57` | **Duplicated `@keyframes fadeInUp`** inline in multiple components. | Extract to shared CSS module or `index.css`. |
| **Low** | `Footer.js:43-45` | Social links use `href="#instagram"` etc. — **hash-only anchors**, no real URLs. | Use real profile URLs or `button`/`span` if non-functional. |
| **Low** | `server.js:18` | Typo `intialPath` (cosmetic/consistency). | Rename to `initialPath`. |
| **Low** | `server.js:76-77` | `app.listen` callback params `(req, res)` — **misleading** (listen callback receives no HTTP req/res). | Use `() => console.log(...)`. |
| **Low** | `ProductCard.test.js:35-36` | Test waits **2.5s** for timeout revert — slow unit test suite. | Mock timers with `jest.useFakeTimers()`. |
| **Low** | `CustomGiftBuilder.test.js:35-36` | Asserts `document.querySelectorAll('script').length === 0` — **fragile** if test runner injects scripts. | Assert on preview DOM container only, not entire `document`. |
| **Low** | `gift-shoppe/package.json:6-8` | Testing libraries in **`dependencies`** instead of `devDependencies`. | Move to devDependencies for production bundle hygiene. |
| **Low** | `ProductCard.js` / catalog | **No product detail pages** — cards are display-only; limited real e-commerce flow. | Add `/product/:id` route when backend exists. |

---

## 4. Code Quality Strengths

- **Clear route structure** in `App.js` for the five implemented pages; layout shell (Header / main / Footer) is consistent.
- **XSS defense in `CustomGiftBuilder`**: regex filtering plus DOMPurify on engraving input, with tests documenting expected behavior (`CustomGiftBuilder.test.js`).
- **Top-level `ErrorBoundary`** in `index.js` with reload affordance and dev-friendly stack in `<details>`.
- **Stable list keys** in product maps (`product.id`) across `Home`, `Shop`, and `Collections`.
- **`CustomGiftBuilder` toast `useEffect`** correctly clears its timeout on cleanup (`CustomGiftBuilder.js:39-44`).
- **Centralized product data** in `data/products.js` — easy to maintain and filter.
- **CSP meta tag** in `public/index.html` shows security awareness for production HTML.
- **Focused unit tests** for pricing logic and add-to-cart UI feedback (even though cart is not real yet).
- **CSS design tokens** via `:root` variables in `index.css` give consistent theming.
- **React 18 `createRoot`** and `StrictMode` used correctly in `index.js`.

---

## 5. Refactoring Priorities (Top 5)

1. **Fix navigation truthfulness** — Implement or remove cart/account/wishlist/support links; add a 404 route. This is the largest user-facing gap (blank pages on most header/footer actions).

2. **Add real cart state** — Context + reducer (or lightweight store) persisted to `localStorage`; connect `ProductCard`, `CustomGiftBuilder`, and `Header` cart total. Until then, rename buttons to “Demo: Add to Cart” to avoid false expectations.

3. **Repair `gift-shoppe` build toolchain** — Add `react-scripts`, verify Tailwind/PostCSS pipeline, set `homepage`/`basename` if deploying to GitHub Pages.

4. **Harden or isolate root `server.js`** — If the auth API is still needed: hash passwords, validate input, fix error handling, use `express` not `express.js`, and document that it is separate from GiftShoppe React. If not needed, remove from the repo to avoid confusion.

5. **Fix React/CSS reliability bugs** — `ProductCard` timer cleanup, scope `Shop.js` global CSS, restore mobile header actions, add `product` null guards and image fallbacks.

---

### Quick Reference: Implemented vs Linked Routes

| Implemented (`App.js`) | Linked but missing |
|------------------------|-------------------|
| `/`, `/shop`, `/build`, `/collections`, `/about` | `/cart`, `/wishlist`, `/account`, `/search`, `/support`, `/track-order`, `/track`, `/new`, `/careers`, `/press`, `/sustainability`, `/faq`, `/shipping`, `/contact`, `/privacy`, `/terms` |

---

*Audit performed in read-only mode against the current workspace. Switch to Agent mode if you want these fixes implemented incrementally.*

---

*Report generated by specialized audit agent — React Shoppe Full Application Audit, June 28, 2026*
