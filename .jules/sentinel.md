# Sentinel Journal 🛡️

## 2025-05-14 - Broken Authentication Hash for 'service' Role
**Vulnerability:** The pre-calculated SHA-256 hash for the 'service' role (PIN '1111') in `v2_secured/js/app.js` was incorrect, preventing login.
**Learning:** The hash was calculated using `echo "1111" | sha256sum` which includes a trailing newline character. Browser-side hashing via `crypto.subtle` does not include this newline, leading to a mismatch.
**Prevention:** Always use `echo -n` when generating hashes from the CLI to ensure consistency with browser-side `TextEncoder` output.

## 2025-05-14 - Sensitive Configuration Leak via Git
**Vulnerability:** The file `v2_secured/js/config.js` containing real Firebase credentials was tracked by Git despite a `.gitignore` rule intended to block it.
**Learning:** The `.gitignore` rule `js/config.js` was not recursive and only applied to the root `js/` directory. Furthermore, files already tracked by Git must be manually removed with `git rm --cached` even if a new ignore rule is added.
**Prevention:** Use recursive ignore patterns like `**/js/config.js` and always audit tracked files with `git ls-files` when implementing security hardening.
