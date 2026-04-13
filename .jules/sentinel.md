## 2026-01-24 - Hashed PIN Authentication
**Vulnerability:** Hardcoded plaintext credentials (PINs) for different roles (cashier, chef, admin, service) in client-side code.
**Learning:** Storing PINs in plaintext within the source code allows any user with access to browser developer tools to easily bypass security controls. While client-side hashing without a salt is still vulnerable to rainbow table attacks for short numeric PINs, it prevents casual discovery and provides a basic level of defense-in-depth.
**Prevention:** Use SHA-256 (or better) hashing via the Web Crypto API for PIN validation. For higher security, implement server-side authentication with unique salts or move sensitive logic to secure backends.
