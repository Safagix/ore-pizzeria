## 2025-05-15 - SHA-256 Hashing for Client-Side PIN Authentication
**Vulnerability:** Access PINs for various roles (cashier, chef, admin, service) were stored in plaintext within the `js/app.js` file, making them easily discoverable via browser developer tools.
**Learning:** Client-side hashing with SHA-256 provides a better "speed bump" than plaintext, but is still vulnerable to brute-force attacks on short PINs and can be bypassed by an attacker modifying local code execution. Using the Web Crypto API (`crypto.subtle`) requires a secure context (HTTPS or localhost).
**Prevention:** Always hash sensitive credentials, even on the client side, and prefer server-side authentication for robust security. Ensure runtime checks for cryptographic APIs to handle insecure environments gracefully.
