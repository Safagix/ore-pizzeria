## 2026-04-09 - [Plaintext Credentials in Client-Side Code]
**Vulnerability:** Hardcoded plaintext PINs for role-based access control were present in the main application logic (`js/app.js`).
**Learning:** Storing credentials in plaintext, especially in client-side code, is a critical security risk as they are easily discoverable via browser developer tools or by inspecting the source code.
**Prevention:** Always use hashing for sensitive data. Even for client-side validation (which can be bypassed by advanced users), hashing provides a necessary layer of defense against casual observation and automated scanning.
