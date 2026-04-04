## 2025-01-24 - [Hashed Credentials Implementation]
**Vulnerability:** Hardcoded credentials (plaintext PINs) were stored directly in `js/app.js` within a `CREDENTIALS` object.
**Learning:** Storing plaintext credentials in client-side code makes them easily discoverable via browser developer tools (F12) or source code inspection, leading to unauthorized access.
**Prevention:** Always use one-way cryptographic hashes (like SHA-256) for credential verification. For client-side apps, ensure that even with hashes, the underlying security model (e.g., Firebase rules) does not rely solely on the client-side check.
