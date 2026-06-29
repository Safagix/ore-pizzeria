## 2025-07-02 - Config Leak and Auth Hash Regression
**Vulnerability:** Sensitive Firebase credentials leaked in `v2_secured/js/config.js` and incorrect authentication hash for the 'service' role in `v2_secured/js/app.js`.
**Learning:** Hardened versions of code can suffer from regressions or partial applications of security fixes if not audited against the baseline.
**Prevention:** Always use recursive patterns in `.gitignore` and audit all entry points during security hardening.
