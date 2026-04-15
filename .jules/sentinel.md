## 2025-05-15 - SHA-256 Hashing for Client-Side Authentication
**Vulnerability:** Hardcoded plaintext PINs in client-side JavaScript (`js/app.js`).
**Learning:** Client-side authentication is fundamentally limited by the exposure of source code. Using SHA-256 hashing via the Web Crypto API (`crypto.subtle.digest`) provides a layer of security that prevents casual inspection of credentials in the browser's developer tools.
**Prevention:** Avoid storing any sensitive information (PINs, API keys, secrets) in plaintext in client-side code. Use hashing for credentials and environment variables for configuration.
