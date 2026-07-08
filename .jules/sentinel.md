# Sentinel Security Journal

## 2026-07-08 - Fixed Credential Leak and Configuration Security
**Vulnerability:** Hardcoded Firebase credentials in `v2_secured/js/config.js` were being tracked by Git despite a root-level `.gitignore` intended to block them. Also discovered that login hashes were being leaked to the console and one authentication hash was incorrect (calculated with a newline).
**Learning:** Root-level ignore rules for specific paths (e.g., `js/config.js`) do not automatically apply to subdirectories if the file is already tracked or if the pattern is not recursive. Hashing strings with utilities like `echo` without `-n` can lead to incorrect hashes due to trailing newlines.
**Prevention:** Use recursive patterns in `.gitignore` (e.g., `**/js/config.js`). Always verify hashes against multiple sources and ensure no sensitive data (even hashes) is logged to the console. Added a runtime check for `window.crypto.subtle` to ensure secure contexts are used for authentication.
