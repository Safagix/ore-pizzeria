## 2025-05-14 - Incorrect Hash in Secured Reference
**Vulnerability:** The pre-calculated SHA-256 hash for the 'service' role (PIN '1111') in the 'v2_secured' reference directory was found to be incorrect because it was hashed with a trailing newline character.
**Learning:** When generating hashes for authentication via command-line tools like `echo`, ensure the use of the `-n` flag to avoid including trailing newlines which are not present in browser-based input.
**Prevention:** Always verify hashes generated in external environments against the target application's encoding logic (usually `TextEncoder` in modern JS).
