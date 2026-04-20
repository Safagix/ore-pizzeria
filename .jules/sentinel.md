## 2025-05-15 - [Vulnerability Reference Mismatch]
**Vulnerability:** Hardcoded SHA-256 hashes in security implementations.
**Learning:** The pre-calculated SHA-256 hash for the 'service' role (PIN '1111') in the 'v2_secured' reference directory was found to be incorrect, potentially causing authentication failures.
**Prevention:** Always independently verify security constants and hashes during implementation rather than blindly trusting reference code. Use reliable tools like `sha256sum` to validate credentials.
