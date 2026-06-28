# Legacy code (archived)

The root Express login server (`server.js`) was removed from the project root during Phase 0 implementation (June 2026).

It stored passwords in plaintext and was not connected to the GiftShoppe React app. Do not restore without bcrypt hashing, environment-based credentials, and proper security middleware.

Legacy client scripts `gift-shoppe/public/js/form.js` and `home.js` were also removed (XSS via `innerHTML`, fake `sessionStorage` auth).

See `docs/01-security-audit.md` and `docs/06-implementation-plan.md`.
