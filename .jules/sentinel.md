## 2026-04-12 - Secure PIN Authentication
**Vulnerability:** Hardcoded plaintext credentials for role-based access control.
**Learning:** Naive authentication in client-side code is easily discoverable via browser dev tools.
**Prevention:** Use SHA-256 hashing for PINs and avoid storing plaintext secrets in the codebase.
