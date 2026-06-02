## 2025-01-24 - Inconsistent XSS Mitigation and Authentication Hash Error
**Vulnerability:** Stored XSS due to inconsistent escaping and broken authentication for the 'service' role.
**Learning:** Hardening attempts in `v2_secured` introduced "escaping at input" which leads to double-escaping issues and doesn't protect all output points. Additionally, the SHA-256 hash for the 'service' role was incorrectly calculated (likely including a newline), breaking legitimate access.
**Prevention:** Always follow the "Escape at Output" principle for XSS protection. Verify all pre-calculated security constants (like hashes) using the exact same normalization/encoding as the runtime environment.
