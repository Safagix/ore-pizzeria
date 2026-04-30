## 2026-04-30 - [Secure Authentication with SHA-256]
**Vulnerability:** Hardcoded plaintext credentials in client-side code allowed easy administrative access.
**Learning:** Client-side hashing provides a speed bump against casual inspection but remains vulnerable to brute-force or direct script manipulation.
**Prevention:** Always hash secrets even in client-side applications, and prioritize server-side authentication for robust security.
