## 2026-01-23 - [PIN Hashing for Role-Based Access]
**Vulnerability:** Hardcoded plaintext PINs in client-side code (`js/app.js`).
**Learning:** Storing plaintext credentials in client-side JavaScript is insecure as they are easily discoverable via browser dev tools.
**Prevention:** Use cryptographic hashes (e.g., SHA-256 via Web Crypto API) to store and verify credentials, even in simple client-side applications.
