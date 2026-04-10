## 2024-05-15 - Hashed Credentials Implementation
**Vulnerability:** Hardcoded plaintext credentials for role-based access control were present in the client-side code (`js/app.js`), allowing any user to discover administrative PINs via source inspection.
**Learning:** The initial implementation relied on "security by obscurity" which is non-existent in client-side web applications. Plaintext storage is a critical vulnerability that can be exploited by anyone with basic browser knowledge.
**Prevention:** Always use cryptographic hashing for credential verification, even in client-side prototypes, to raise the effort required for unauthorized access. For more robust security, authentication should be handled on the server side using established identity providers like Firebase Auth.
