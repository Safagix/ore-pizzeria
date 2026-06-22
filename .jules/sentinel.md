# Sentinel Security Journal

## 2025-05-14 - Git Tracking of Sensitive Config Files
**Vulnerability:** `v2_secured/js/config.js` containing Firebase API keys was being tracked by Git despite `.gitignore` having `js/config.js`.
**Learning:** Root-level `.gitignore` rules (like `js/config.js`) do not automatically prevent tracking of identically named files in subdirectories if they were committed before the rule or if the rule isn't recursive (using `**/`).
**Prevention:** Use recursive patterns like `**/js/config.js` and audit tracked files with `git ls-files` to ensure sensitive data isn't accidentally committed.

## 2025-05-14 - Incorrect Authentication Hash for Service Role
**Vulnerability:** The pre-calculated SHA-256 hash for the 'service' role (PIN '1111') in `v2_secured/js/app.js` was incorrect.
**Learning:** The hash likely included a trailing newline character (common when using `echo "1111" | sha256sum`), making it impossible for browser-based inputs to match.
**Prevention:** Always verify hashes against browser-standard implementations (like `crypto.subtle`) during development to ensure compatibility with user input.
