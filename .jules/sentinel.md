## 2025-01-24 - Secure Authentication Upgrade
**Vulnerability:** Hardcoded plaintext PINs in client-side code for role-based access control.
**Learning:** Storing credentials in plaintext within JavaScript files makes them easily accessible via browser developer tools, leading to complete system compromise by any user.
**Prevention:** Always hash sensitive credentials. Even for client-side "speed bump" authentication, use strong hashing algorithms like SHA-256 and avoid plaintext storage.
