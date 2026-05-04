## 2025-05-15 - SHA-256 Hashing for Client-Side PINs
**Vulnerability:** Hardcoded plaintext PINs in client-side JavaScript were used for role-based access control, allowing anyone with source code access to see administrative credentials.
**Learning:** While client-side hashing is a "speed bump" that can be bypassed by modifying local code, replacing plaintext with hashes prevents passive exposure. Using the Web Crypto API (`crypto.subtle`) requires making the authentication flow asynchronous, which may impact UI event handlers if they expect synchronous execution.
**Prevention:** Always hash credentials, even on the client side, and prefer server-side authentication whenever possible. Use unique salts for each user/role to prevent rainbow table attacks, even for short numeric PINs.
