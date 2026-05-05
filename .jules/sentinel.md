## 2026-05-05 - Hashed Credentials and Secure Context
**Vulnerability:** Hardcoded plaintext PINs in client-side code (`js/app.js`) were easily discoverable by anyone inspecting the source.
**Learning:** Moving from plaintext to SHA-256 hashing in the client provides a "speed bump" against casual discovery, but remains vulnerable to brute-force (for short PINs) and script manipulation. Furthermore, the Web Crypto API requires a secure context (HTTPS/localhost).
**Prevention:** Always hash credentials (preferably server-side). When implementing client-side hashing, use a robust algorithm, remove plaintext from comments, and ensure `window.crypto.subtle` availability is checked.
