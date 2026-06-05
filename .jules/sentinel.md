## 2025-05-15 - Hardcoded Secrets in Subdirectories
**Vulnerability:** Hardcoded Firebase configuration in `v2_secured/js/config.js` was being tracked by Git despite a root-level `.gitignore` rule for `js/config.js`.
**Learning:** Root-level `.gitignore` rules like `js/config.js` do not automatically match similarly named files in subdirectories (like `v2_secured/js/config.js`) if those files were committed before the rule was added or if the pattern is not recursive.
**Prevention:** Use recursive patterns in `.gitignore` (e.g., `**/js/config.js`) and audit tracked files using `git ls-files` to ensure sensitive configuration is not leaked.

## 2025-05-15 - Incorrect Authentication Hash
**Vulnerability:** The SHA-256 hash for the 'service' role was incorrect because it was calculated with a trailing newline character, preventing successful login with the intended PIN '1111'.
**Learning:** Terminal-based hashing tools (like `openssl dgst`) often include trailing newlines by default if using `echo` without `-n`. This results in hashes that mismatch browser-generated hashes from `crypto.subtle`.
**Prevention:** Always use `echo -n` when generating hashes in the terminal for comparison with browser-side logic, and perform end-to-end authentication tests.
