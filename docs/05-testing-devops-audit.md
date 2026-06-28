# React Shoppe — Testing, Dependencies & DevOps Audit

**Project root:** `d:\desktop\Web Development\React Shoppe`  
**App path:** `gift-shoppe/`  
**Audit date:** June 28, 2026

---

## 1. Executive Summary

React Shoppe is a Create React App–style storefront with routing, a custom gift builder, and product browsing. The **testing story is fragmented**: two unit test files cover `ProductCard` and `CustomGiftBuilder`, while three Cypress suites describe a **different application** (cart, checkout, login, multi-step gift wizard) that is not implemented in `src/`.

**Critical blockers:**

| Area | Status |
|------|--------|
| `react-scripts` | Referenced in scripts but **absent** from `package.json` and `package-lock.json` |
| Cypress | Scripts exist (`cy:open`, `cy:run`) but **not installed**; no `cypress/support/` |
| CI/CD | **No** `.github/workflows/` or other automation found |
| E2E vs app | Cypress specs **will fail** against current UI/routes |
| `build/` | **Present on disk** (CRA + legacy static assets) despite `gift-shoppe/.gitignore` listing `/build` |
| Firebase | `firebase.js` has hardcoded config but is **never imported** |
| Toolchain | `openssl-legacy-provider` workaround on `start`/`build` only; root cause (old webpack/OpenSSL) unaddressed |

**Overall risk:** High for reproducible builds, CI, and meaningful test signal. Unit tests are a reasonable start for two components but leave most features untested. E2e tests currently add noise, not confidence.

---

## 2. Test Coverage Assessment

### 2.1 Unit tests (`gift-shoppe/src/*.test.js`)

| File | Tests | What is covered |
|------|-------|-----------------|
| `gift-shoppe/src/ProductCard.test.js` | 2 | Product render (name, price `₹49.99`, category); Add to Cart → “Added •” → revert after ~2s |
| `gift-shoppe/src/CustomGiftBuilder.test.js` | 3 | XSS regex + DOMPurify on engraving input; base × material price math; success toast on submit |

**Total: 5 unit tests across 2 of 11 source modules** (excluding `data/products.js`, `reportWebVitals.js`).

#### Tested (unit)

- `ProductCard.js` — display and cosmetic cart button state
- `CustomGiftBuilder.js` — partial: price calc (base + material only), engraving sanitization, toast

#### Untested (unit) — by feature/module

| Module / feature | Path | Gap |
|------------------|------|-----|
| App shell & routing | `gift-shoppe/src/App.js` | No route tests (`/`, `/build`, `/shop`, `/collections`, `/about`) |
| Home page | `gift-shoppe/src/Home.js` | Hero, trust badges, embedded builder, product grids |
| Shop + filters | `gift-shoppe/src/Shop.js` | Category sidebar, `filteredProducts`, result count |
| Collections | `gift-shoppe/src/Collections.js` | Product grid rendering |
| About | `gift-shoppe/src/About.js` | Static content |
| Header / nav | `gift-shoppe/src/Header.js` | Hamburger menu, `NavLink` active state, dead links |
| Footer | `gift-shoppe/src/Footer.js` | Link grid, copyright |
| Error boundary | `gift-shoppe/src/ErrorBoundary.js` | Fallback UI, reload button |
| Product data | `gift-shoppe/src/data/products.js` | Shape/IDs of `featuredProducts`, `shopByItemProducts` |
| CustomGiftBuilder (gaps) | `gift-shoppe/src/CustomGiftBuilder.js` | Engraving **+₹100** surcharge, `maxLength={20}`, font/color preview, button disabled during toast |
| Real cart / checkout / auth | N/A in `src/` | **Not implemented** — no cart state, modal, or checkout |

#### Unit test quality notes

- `CustomGiftBuilder.test.js` SEC-001 asserts `document.querySelectorAll('script').length === 0` — brittle and not a strong XSS guarantee; jsdom may pass while real browsers differ.
- No `setupTests.js`, no `App.test.js`, no coverage config (`--coverage` / thresholds).
- `npm test` uses `react-scripts test` without `CI=true` / `--watchAll=false` (problematic for automation).

---

### 2.2 Cypress E2E (`gift-shoppe/cypress/`)

| File | Specs | Intended coverage |
|------|-------|-------------------|
| `gift-shoppe/cypress/e2e/functional.cy.js` | 3 | Add to cart + cart modal; custom gift flow; checkout validation |
| `gift-shoppe/cypress/e2e/edge.cy.js` | 3 | Negative quantity; long inputs; offline checkout |
| `gift-shoppe/cypress/e2e/security.cy.js` | 3 | XSS in gift builder; auth on `/checkout`; session tokens |

**Config:** `gift-shoppe/cypress.config.js` — `baseUrl: http://localhost:3000`, no `supportFile`, no plugins.

#### E2E vs actual app — major mismatches

| Cypress expects | Actual app (`gift-shoppe/src/`) |
|-----------------|----------------------------------|
| `/custom-gift` | `/build` (`App.js` line 21–23) |
| `.cart-count`, `.cart-modal`, `.cart-item` | **Do not exist** — `Header.js` only shows static `₹0.00` and link to `/cart` |
| `/checkout`, `/login`, `/cart` routes | **Not defined** in `App.js` |
| Multi-step builder: “Luxury Wooden Box”, “Gourmet Chocolate”, `Enter recipient name` | Single-page builder: selects for base item/material, placeholder `Enter name (Letters/Numbers only)` |
| Checkout `POST **/checkout` | No checkout API or form |
| `cy.contains(...).or(...)` in `edge.cy.js` | **Invalid Cypress API** — will syntax-fail |
| Auth / `userToken` in localStorage | **No auth** implementation |

**Verdict:** All 9 Cypress tests are **out of sync** with the current codebase. They appear written for a prior or planned version of the shop.

---

### 2.3 Coverage gap summary (features)

```
Feature                    Unit    E2E (valid?)   Notes
─────────────────────────────────────────────────────────────
Product cards              ✓       ✗ (cart)       Cart is UI-only toggle
Custom gift builder        ~✓      ✗ (wrong UI)   Route/UI mismatch
Shop category filter       ✗       ✗
Collections page           ✗       ✗
About / Home sections      ✗       ✗
Navigation / routing       ✗       ✗
Header mobile menu         ✗       ✗
Footer links               ✗       ✗
Error boundary             ✗       ✗
Cart / wishlist / account  ✗       ✗ (phantom)    Linked in Header, no pages
Checkout / payments      ✗       ✗ (phantom)
Auth / sessions            ✗       ✗ (phantom)
Firebase integration       ✗       ✗              Config unused
Security (CSP, XSS)        ~✓      ✗              CSP in public/index.html untested
```

---

## 3. Findings Table

| Severity | Area | Issue | Recommendation |
|----------|------|-------|----------------|
| **Critical** | Dependencies | `react-scripts` missing from `gift-shoppe/package.json` and `package-lock.json`; all CRA scripts depend on it | Add `react-scripts@5.0.1` (or migrate to Vite); run `npm install` and verify `build`/`test`/`start` |
| **Critical** | Dependencies | Cypress referenced in scripts but not in `devDependencies`; no `cypress/support/` | Add `cypress` as devDependency; add `cypress/support/e2e.js`; pin version |
| **Critical** | E2E | Cypress specs target non-existent routes/UI (`/custom-gift`, cart, checkout, login) | Rewrite e2e against `/build`, real selectors, and implemented flows; remove phantom features or implement them first |
| **Critical** | CI/CD | No GitHub Actions or other CI | Add workflow: install → lint → unit tests → build → (optional) Cypress |
| **High** | Build artifacts | `gift-shoppe/build/` exists (CRA bundles + legacy `css/`, `js/` from `public/`) while `.gitignore` ignores `/build` | Remove `build/` from repo; deploy via CI artifact or `gh-pages` branch only |
| **High** | `.gitignore` | Root `.gitignore` only has `node_modules/` and `package-lock.json` | Expand root ignore; **stop ignoring** `package-lock.json` — commit lockfile for reproducible installs |
| **High** | DevOps | `openssl-legacy-provider` on `start`/`build` only (`package.json` lines 16–19) | Upgrade to `react-scripts@5` + Node 18 LTS, or migrate off CRA; remove flag when webpack 5+ resolves OpenSSL 3 |
| **High** | Security | `gift-shoppe/src/firebase.js` hardcodes API keys; file unused | Move to env vars (`REACT_APP_*`); restrict Firebase rules; delete or wire up SDK |
| **High** | Security | CSP in `gift-shoppe/public/index.html` allows `'unsafe-inline'` and `'unsafe-eval'` | Tighten CSP; add e2e/security tests once app matches specs |
| **Medium** | Testing | 5 unit tests / ~2 components; no integration or routing tests | Add RTL tests for `App`, `Shop` filters, `Header` nav; target 60%+ on critical paths |
| **Medium** | Testing | `CustomGiftBuilder` engraving +₹100 and `maxLength={20}` untested | Add cases in `CustomGiftBuilder.test.js` |
| **Medium** | Testing | `ErrorBoundary` untested | Trigger render error in test; assert fallback UI |
| **Medium** | Dependencies | `tailwindcss` in devDeps + `@tailwind` in `index.css` but **no** `postcss.config.js`; no Tailwind classes in `src/` | Remove Tailwind or add PostCSS + CRACO; currently dead weight |
| **Medium** | Dependencies | `react-router-dom@5.3.0` (legacy API: `Switch`, `activeClassName`) | Plan upgrade to v6+ when refactoring routes |
| **Medium** | Deployment | `predeploy`/`deploy` use `gh-pages -d build` but no `homepage` field in `package.json` | Set `"homepage": "https://<user>.github.io/<repo>"` for correct asset paths on GitHub Pages |
| **Medium** | Deployment | Firebase config present but no Firebase Hosting scripts | Choose one host (gh-pages vs Firebase); document in README |
| **Low** | Documentation | `gift-shoppe/README.md` is default CRA boilerplate | Document Node version, OpenSSL workaround, env vars, test commands, deploy steps |
| **Low** | Documentation | No `.env.example` | Add template for Firebase/analytics keys |
| **Low** | Product | Many Header/Footer links (`/cart`, `/account`, `/checkout`, etc.) have no routes | Add 404 route or implement features; test link behavior |
| **Low** | E2E | `edge.cy.js` uses invalid `.or()` chaining | Fix assertions; use separate `cy.get()` checks or custom command |
| **Low** | Git | No `.git/` at project root (not a git repo or repo elsewhere) | Initialize git + CI if not already remote-tracked |

---

## 4. Dependency Audit

### 4.1 `gift-shoppe/package.json` scripts

| Script | Command | Health |
|--------|---------|--------|
| `start` | `react-scripts --openssl-legacy-provider start` | Broken without `react-scripts`; legacy flag masks Node/OpenSSL issue |
| `build` | `react-scripts --openssl-legacy-provider build` | Same |
| `test` | `react-scripts test` | Broken without `react-scripts`; no CI-friendly flags |
| `predeploy` / `deploy` | `npm run build` → `gh-pages -d build` | Depends on working build |
| `cy:open` / `cy:run` | Cypress CLI | Broken — Cypress not installed |
| `eject` | `react-scripts eject` | Broken without `react-scripts` |

### 4.2 Declared dependencies (locked versions from `package-lock.json`)

| Package | Locked | Notes |
|---------|--------|-------|
| `react` / `react-dom` | 18.2.0 | Behind React 19; fine for stability |
| `react-router-dom` | 5.3.0 | Outdated; v6+ is current |
| `@testing-library/react` | 13.4.0 | Behind v14–16; upgrade with React 18+ |
| `@testing-library/jest-dom` | ^5.16.5 | Stable |
| `@testing-library/user-event` | ^13.5.0 | v14+ available |
| `dompurify` | 3.3.3 | Recent; good for XSS layer |
| `web-vitals` | ^2.1.4 | v3+ available |
| `gh-pages` | 6.1.1 | OK |
| `tailwindcss` | 3.3.1 | Unused in components; incomplete CRA integration |
| **`react-scripts`** | — | **MISSING** — critical |
| **`cypress`** | — | **MISSING** — critical for e2e scripts |

### 4.3 Risky / outdated patterns

1. **Create React App without `react-scripts`** — project cannot build from a clean `npm ci`.
2. **CRA + `--openssl-legacy-provider`** — typical of Node 17+ with webpack 4; indicates old toolchain.
3. **CRA itself** — unmaintained; long-term migrate to Vite or Next.js.
4. **Root `.gitignore` ignores `package-lock.json`** — non-reproducible installs across machines/CI.
5. **Committed `build/`** — stale deploy artifacts, merge noise, possible secret leakage in source maps (`build/static/js/*.map` present).
6. **Hardcoded Firebase keys** in `gift-shoppe/src/firebase.js` — rotate if ever committed publicly; use env + Firebase App Check.

### 4.4 `openssl-legacy-provider` implications

- **Why it exists:** Node 17+ uses OpenSSL 3.0; older webpack (CRA 4 / webpack 4) uses MD4 hashing, which fails without the legacy provider.
- **Where applied:** Only `start` and `build` in `package.json` — **not** on `test`.
- **Risks:** Hides underlying incompatibility; may break on future Node versions; not suitable as a permanent fix.
- **Fix path:** `react-scripts@5` (webpack 5) on Node 18 LTS, or migrate to Vite; then remove `--openssl-legacy-provider` from both scripts.

---

## 5. Recommended Test Strategy & CI Pipeline

### 5.1 Test strategy (phased)

**Phase 1 — Restore toolchain (prerequisite)**

1. Add `react-scripts@5.0.1` (or migrate to Vite).
2. Add `cypress@13.x` with `cypress/support/e2e.js`.
3. Document Node 18 LTS in README; remove OpenSSL flag after upgrade.

**Phase 2 — Fix unit tests**

| Priority | Target | Example cases |
|----------|--------|---------------|
| P0 | `CustomGiftBuilder.test.js` | Engraving +₹100; 20-char limit; font/color in preview |
| P0 | `App.js` + router | Each route renders expected heading/component |
| P1 | `Shop.js` | Category filter changes product count |
| P1 | `Header.js` | Menu toggle, active nav link |
| P2 | `ErrorBoundary.js` | Child throw → fallback + reload |
| P2 | `products.js` | Snapshot or schema test for product shape |

Run: `CI=true npm test -- --watchAll=false --coverage`

**Phase 3 — Rewrite Cypress (aligned to real app)**

```text
functional.cy.js (new)
  - Visit / → featured products visible
  - Add to cart on home → button shows "Added •"
  - Visit /build → configure builder → toast appears
  - Visit /shop → filter by category → grid updates
  - Nav: Home → Shop → Collections → About

security.cy.js (new)
  - /build: inject <script> in engraving → sanitized preview only
  - Optional: CSP headers if served in prod-like env

edge.cy.js (new)
  - Engraving at maxLength 20
  - Unknown routes (/cart) → blank or 404 (once implemented)
```

Use `cy:run` only after `start` is running (or `start-server-and-test`).

**Phase 4 — Coverage goals**

| Layer | Target |
|-------|--------|
| Unit (RTL) | 70%+ on `src/components` with business logic |
| E2E | Happy paths for all 5 routed pages + custom builder |
| Manual | gh-pages deploy smoke test on GitHub Pages URL |

---

### 5.2 Recommended CI pipeline (GitHub Actions)

No workflows exist today. Suggested file: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:

defaults:
  run:
    working-directory: gift-shoppe

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
          cache-dependency-path: gift-shoppe/package-lock.json

      - run: npm ci

      - name: Unit tests
        run: npm test -- --watchAll=false --coverage
        env:
          CI: true

      - name: Production build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        if: matrix.node-version == '18.x'
        with:
          directory: gift-shoppe/coverage

  e2e:
    runs-on: ubuntu-latest
    needs: test-and-build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
          cache-dependency-path: gift-shoppe/package-lock.json

      - run: npm ci
      - run: npx start-server-and-test start http://localhost:3000 cy:run
        env:
          CI: true

  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: [test-and-build, e2e]
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
      - run: npm ci
        working-directory: gift-shoppe
      - run: npm run deploy
        working-directory: gift-shoppe
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Also add:**

- `start-server-and-test` as devDependency for e2e in CI
- `npm test -- --watchAll=false` in package.json as `"test:ci"`
- Remove `build/` from git; let `gh-pages` publish from CI only
- Commit `gift-shoppe/package-lock.json`; remove it from root `.gitignore`

---

### 5.3 Firebase & gh-pages deployment

| Item | Current state | Recommendation |
|------|---------------|----------------|
| `gift-shoppe/src/firebase.js` | Config only; not imported | Delete or integrate Analytics/Auth; use `REACT_APP_FIREBASE_*` |
| `gh-pages` | `predeploy` + `deploy` scripts present | Set `homepage` in `package.json`; deploy from CI on green builds |
| GitHub Pages | No automation | Use `peaceiris/actions-gh-pages` or built-in `npm run deploy` |
| Firebase Hosting | No `firebase.json` | If using Firebase, add hosting config and separate workflow |

---

## Appendix: Key file inventory

| Path | Role |
|------|------|
| `gift-shoppe/package.json` | Scripts, deps (incomplete) |
| `gift-shoppe/package-lock.json` | Lockfile (no react-scripts/cypress) |
| `gift-shoppe/.gitignore` | Ignores `/build` (but build exists on disk) |
| `.gitignore` (root) | Minimal; ignores lockfile |
| `gift-shoppe/src/App.js` | Routes: `/`, `/build`, `/shop`, `/collections`, `/about` |
| `gift-shoppe/src/*.test.js` | 2 test files, 5 tests |
| `gift-shoppe/cypress/e2e/*.cy.js` | 3 suites, 9 tests (misaligned) |
| `gift-shoppe/cypress.config.js` | E2E config |
| `gift-shoppe/build/` | Committed/stale production output |
| `gift-shoppe/src/firebase.js` | Unused Firebase config |
| `gift-shoppe/README.md` | Default CRA docs only |
| `gift-shoppe/public/index.html` | CSP meta tag |

---

**Bottom line:** Treat current Cypress suites as **legacy placeholders** until rewritten. First restore `react-scripts` (or migrate), align tests with the real app at `/build`, add CI, and clean up `build/` artifacts and `.gitignore`. That sequence will turn testing and DevOps from high-risk to maintainable.

---

*Report generated by specialized audit agent — React Shoppe Full Application Audit, June 28, 2026*
