## 2025-05-21 - Fix Hardcoded Credentials in Client-Side Code
**Vulnerability:** Hardcoded PINs for different roles (cashier, chef, admin, service) were stored in plaintext within `js/app.js`.
**Learning:** Storing plaintext credentials in client-side JavaScript allows any user with access to the browser's developer tools to easily discover and exploit them.
**Prevention:** Always hash sensitive credentials before storage and comparison. For client-side applications where a backend is limited, utilize the Web Crypto API for secure, asynchronous hashing.
