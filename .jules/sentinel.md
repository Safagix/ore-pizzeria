## 2025-01-24 - Client-side PIN Hashing
**Vulnerability:** Hardcoded plaintext credentials in client-side JavaScript.
**Learning:** Storing plaintext credentials in client-side code is a critical vulnerability as any user can easily discover them via browser developer tools.
**Prevention:** Implement client-side hashing as a first-line "speed bump" and ensure robust server-side authentication for sensitive operations.
