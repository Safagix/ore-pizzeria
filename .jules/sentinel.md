## 2026-01-23 - Hardcoded Credentials in Client-Side Code
**Vulnerability:** Role-based PINs (e.g., '1234', 'admin123') were stored in plaintext within the `app.login` function in `js/app.js`, making them easily discoverable via browser developer tools.
**Learning:** Storing secrets in client-side code, even for non-critical roles, is a "Security by Obscurity" pattern that fails as soon as a user inspects the source code.
**Prevention:** Always hash credentials on the client side before comparison (if a backend is not performing the check) and prefer server-side authentication whenever possible.
