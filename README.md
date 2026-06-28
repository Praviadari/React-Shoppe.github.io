# React Shoppe

This repository contains **GiftShoppe**, a premium React e-commerce storefront.

## Quick start

The canonical application lives in [`gift-shoppe/`](./gift-shoppe/):

```bash
cd gift-shoppe
npm install
npm start
```

Copy `gift-shoppe/.env.example` to `gift-shoppe/.env.local` and add your Firebase and Razorpay keys.

## Documentation

Implementation plan and audit reports are in [`docs/`](./docs/):

- [Implementation plan](./docs/06-implementation-plan.md)
- [Audit overview](./docs/README.md)

## Legacy

Older root-level artifacts have been moved to [`legacy/`](./legacy/) where applicable. Do not use them for new development.

## Scripts (from `gift-shoppe/`)

| Command | Description |
|---------|-------------|
| `npm start` | Development server |
| `npm run build` | Production build + sitemap |
| `npm run test:ci` | Jest with coverage |
| `npm run cy:ci` | Cypress E2E against production build |
| `npm run deploy:rules` | Deploy Firestore security rules |
| `npm run generate:webp` | Convert product JPEGs to WebP |
| `npm run prerender` | Generate static HTML for SEO crawlers |
| `npm run lhci` | Run Lighthouse CI against production build |
| `npm run deploy:functions` | Deploy Cloud Functions (cart validation, Razorpay) |
