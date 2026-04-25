## 2026-01-23 - Client-Side PIN Hashing Learning
**Vulnerability:** Hardcoded plaintext PINs in client-side code (`js/app.js`).
**Learning:** While hashing PINs in the client is better than plaintext, 4-digit PINs are easily brute-forced. However, it prevents casual inspection of source code. Also, `crypto.subtle` requires a secure context (HTTPS/localhost).
**Prevention:** Use SHA-256 (or better, PBKDF2 with salt) for client-side hashing to avoid plaintext exposure. Always prioritize server-side authentication when possible.
