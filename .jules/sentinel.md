# Sentinel Journal - Critical Security Learnings

This journal contains critical security learnings discovered during the protection of the Ore Pizzeria codebase.

## 2026-05-22 - Incorrect Hash for 'service' role in reference implementation
**Vulnerability:** The pre-calculated SHA-256 hash for the 'service' role (PIN '1111') in the 'v2_secured' directory was incorrect.
**Learning:** Manual calculation of hashes can lead to errors. The reference implementation used '0ffe1abd1a08215353c233d6e009613eb95eab46e11d16a63450d90946521172' instead of '0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c'.
**Prevention:** Always verify hashes using reliable tools (like OpenSSL or Node.js crypto) before hardcoding them into security logic.
