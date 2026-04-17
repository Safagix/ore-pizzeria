## 2025-01-24 - Correcting Service Role SHA-256 Hash
**Vulnerability:** Hardcoded plaintext credentials and incorrect reference hash.
**Learning:** The reference secured version `v2_secured/js/app.js` contained an incorrect SHA-256 hash for the 'service' role (PIN '1111'). The expected hash for '1111' is `0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c`, while the reference had a typo (`...b95eab46e11d16a63450d90946521172` vs `...95eec4253832a761af28ff37ac5a150c`).
**Prevention:** Always verify pre-calculated hashes using standard tools like `sha256sum` and ensure they match the intended plaintext input exactly.
