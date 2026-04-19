# Sentinel Journal - Critical Security Learnings

## 2025-05-14 - [Hardcoded Credentials in Client-Side Code]
**Vulnerability:** Access PINs for various roles (cashier, chef, admin, service) were hardcoded in plaintext within the `js/app.js` file.
**Learning:** This is a common pattern in "Security by Obscurity" where developers assume users won't look at the source code. However, any client-side code is fully accessible to the user via browser developer tools.
**Prevention:** Never store secrets or credentials in plaintext on the client side. Use asynchronous hashing (like SHA-256 with Web Crypto API) for client-side verification to raise the bar for casual inspection, though true security requires server-side authentication.
