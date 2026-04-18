# Sentinel Journal - Critical Security Learnings

## 2025-05-14 - Secure Hashing for PIN Authentication
**Vulnerability:** Hardcoded plaintext PINs for various user roles (cashier, chef, admin, service) were stored directly in `js/app.js`, making them easily discoverable via source code inspection.
**Learning:** Relying on plaintext credentials in client-side JavaScript provides no actual security against even casual observation. Transitioning to SHA-256 hashing via the Web Crypto API improves security by ensuring that only the hash of the secret is stored, although client-side hashing alone still remains vulnerable to brute-force if the secret space (e.g., 4-digit PINs) is small.
**Prevention:** Never store plaintext secrets in code. Use industry-standard cryptographic hashing for credentials. For higher security, implement authentication on a trusted server and use salted hashes or robust derivation functions like PBKDF2/Argon2.
