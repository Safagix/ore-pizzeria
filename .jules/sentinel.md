## 2025-05-15 - Security Discovery: Incorrect Hash in Reference Directory
**Vulnerability:** Weak authentication and potential for login failure due to incorrect hash.
**Learning:** The pre-calculated SHA-256 hash for the 'service' role (PIN '1111') in the 'v2_secured' reference directory was found to be incorrect ('...b95eab46e11d16a63450d90946521172' instead of '...95eec4253832a761af28ff37ac5a150c').
**Prevention:** Always verify hashes using multiple tools or automated scripts when migrating from plaintext to hashed credentials.
