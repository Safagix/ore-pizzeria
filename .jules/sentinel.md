## 2026-04-24 - Client-Side Authentication Hashing
**Vulnerability:** Critical roles (Admin, Cashier, Chef) had their access PINs hardcoded in plaintext within the main application logic, making them visible to anyone using browser developer tools.
**Learning:** The application relied on "security by obscurity," assuming users wouldn't inspect the source code. This is extremely dangerous in a POS system where access to the Admin panel allows data manipulation and financial record deletion.
**Prevention:** Implement asynchronous SHA-256 hashing using the native Web Crypto API (`crypto.subtle.digest`) for all client-side role-based authentication. Store only the pre-calculated hashes to ensure that even if the source code is inspected, the original PINs remain protected.
