## 2026-04-26 - [Hardcoded plaintext PINs]
**Vulnerability:** The application stored role-based PINs in a plaintext object within the client-side JavaScript (`js/app.js`).
**Learning:** Plaintext secrets in client-side code are easily discoverable by anyone using browser developer tools, rendering "security by obscurity" ineffective.
**Prevention:** Never store plaintext secrets on the client. Use strong cryptographic hashes like SHA-256 for comparisons if client-side validation is necessary, and ensure the hashing process is performed in a secure context.
