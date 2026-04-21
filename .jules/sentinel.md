## 2026-04-21 - Asynchronous SHA-256 Authentication
**Vulnerability:** Hardcoded plaintext credentials for role-based access control.
**Learning:** Short, numeric PINs hashed with SHA-256 without a unique salt remain vulnerable to rainbow table or brute-force attacks in client-side code.
**Prevention:** Use server-side authentication (e.g., Firebase Auth) or at least incorporate a unique salt and a more robust key derivation function like PBKDF2 if client-side hashing is the only option.
