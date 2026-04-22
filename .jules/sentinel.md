## 2025-05-14 - Hardcoded Plaintext Credentials in Client-Side Code
**Vulnerability:** Sensitive credentials (PINs) for different roles (cashier, chef, admin, service) were stored in plaintext within the `js/app.js` file.
**Learning:** The application relied on "security by obscurity," assuming users wouldn't inspect the client-side source code.
**Prevention:** Never store secrets in plaintext. Use secure hashing algorithms like SHA-256 for credential verification, even in client-side prototypes, to raise the barrier for attackers.
