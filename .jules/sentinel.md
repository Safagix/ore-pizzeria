## 2026-05-02 - Secure Hashing and XSS Prevention in POS
**Vulnerability:** Hardcoded plaintext credentials and Stored XSS in the dashboard.
**Learning:** Client-side authentication using SHA-256 hashes is a "speed bump" that prevents casual inspection but does not replace server-side verification. The Web Crypto API requires a secure context (HTTPS/localhost). HTML entity encoding must be applied consistently when using `innerHTML` with user-controlled data.
**Prevention:** Move authentication to the server-side whenever possible. Use a standard `escapeHtml` utility for all dynamic DOM injections. Avoid inline event handlers and use data attributes instead.
