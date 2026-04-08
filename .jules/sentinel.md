## 2026-04-08 - Secure PIN Hashing with Web Crypto API
**Vulnerability:** Hardcoded plaintext PINs for all user roles (cashier, chef, admin, service) were stored directly in the frontend application logic.
**Learning:** Storing plaintext credentials in client-side code exposes them to anyone who can view the source. Even if the PIN is only used for local role switching, it should be protected against casual exposure.
**Prevention:** Always use cryptographic hashes (like SHA-256) when storing or comparing credentials, even in frontend applications. Use the native Web Crypto API for secure and performant hashing without external dependencies.
