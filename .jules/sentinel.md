## 2025-05-14 - Hardcoded Credentials and Reference Inconsistency
**Vulnerability:** Plaintext PINs were hardcoded in the `login` function, making them easily discoverable via browser developer tools. Additionally, a secured reference version contained an incorrect SHA-256 hash for one of the roles.
**Learning:** Hardcoding credentials in client-side code is a critical risk. Relying on pre-calculated hashes from reference directories without independent verification can lead to authentication failures if the hashes are incorrect.
**Prevention:** Always use hashing (and ideally salting) for any client-side credential verification to prevent casual discovery. Verify all security constants (like hashes) against a known source of truth during implementation.
