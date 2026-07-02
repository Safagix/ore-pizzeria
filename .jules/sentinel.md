# Sentinel Security Journal 🛡️

## 2025-05-15 - Hardcoded Secrets and Incorrect Auth Hashes

**Vulnerability:**
1. The sensitive Firebase configuration file `v2_secured/js/config.js` is currently being tracked by Git, exposing the `apiKey` and other project details in version control history.
2. The authentication hash for the 'service' role in `v2_secured/js/app.js` is incorrect. It was likely generated with a trailing newline character (e.g., via `echo "1111" | sha256sum`), which causes login failures when the user enters the PIN '1111' in a browser.

**Learning:**
- Root-level `.gitignore` rules (like `js/config.js`) do not automatically stop tracking files that were already committed before the rule was added, or files in subdirectories that don't match the pattern exactly if not using `**/`.
- When pre-calculating hashes for authentication, environment-specific character handling (like newlines from shell commands) can lead to mismatches between the server/code-stored hash and the client-side generated hash.

**Prevention:**
- Use recursive patterns in `.gitignore` (e.g., `**/js/config.js`) and audit tracked files regularly using `git ls-files`.
- Always generate hashes for browser-based authentication using the same methods/inputs the client will use, ensuring no hidden characters are included.
