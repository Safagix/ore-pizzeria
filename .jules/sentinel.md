# Sentinel Security Journal - Ore Pizzeria

## 2025-05-14 - Initial Security Audit
**Vulnerability:** Found `v2_secured/js/config.js` containing real Firebase credentials being tracked by Git.
**Learning:** Root-level `.gitignore` rules like `js/config.js` only apply to the root directory if not using a recursive pattern like `**/js/config.js`.
**Prevention:** Use recursive patterns for common configuration file names in `.gitignore` and audit tracked files periodically using `git ls-files`.

## 2025-05-14 - Authentication Hash Mismatch
**Vulnerability:** The 'service' role hash in `v2_secured/js/app.js` was pre-calculated with a trailing newline, making it impossible to log in with the correct PIN '1111'.
**Learning:** Pre-calculating hashes in different environments (like echo vs browser) can lead to mismatches due to hidden characters like newlines.
**Prevention:** Always verify pre-calculated hashes against the actual hashing implementation used in the application.
