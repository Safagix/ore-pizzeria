## 2025-05-15 - Hashed Credentials and Async Auth Flow
**Vulnerability:** Hardcoded plaintext PINs in client-side JavaScript (`js/app.js`).
**Learning:** Moving from synchronous plaintext comparisons to asynchronous SHA-256 hashing in a legacy Vanilla JS app requires updating all call sites (often inline HTML `onclick` handlers) to handle Promises and ensuring the availability of the Web Crypto API (`crypto.subtle`).
**Prevention:** Always store credentials as hashes (even on the client-side as a basic speed bump) and perform a runtime check for a Secure Context (HTTPS/localhost) when relying on `crypto.subtle`.
