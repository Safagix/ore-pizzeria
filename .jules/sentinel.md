# Sentinel Security Journal

## 2025-05-14 - Initialization and Critical Findings
**Vulnerability:** Git is tracking `v2_secured/js/config.js` which contains live Firebase credentials, and the 'service' role hash in `v2_secured/js/app.js` is incorrect/mismatched with the root version.
**Learning:** Even if a root-level `.gitignore` excludes a file path (like `js/config.js`), it doesn't automatically stop tracking files that were already committed or files in subdirectories if the pattern isn't recursive (e.g., `**/js/config.js`). Additionally, "secured" versions of code can drift from the root version, leading to broken authentication.
**Prevention:** Always use recursive patterns in `.gitignore` for configuration files. Audit tracked files using `git ls-files` to ensure no secrets are being tracked. Ensure functional parity between different versions of authentication logic.
