## 2026-07-29 - Config Exclusions and Web Crypto Security Checks

**Vulnerability:** Git tracking of hardcoded configuration files in subdirectories (e.g., `v2_secured/js/config.js`) despite having root-level `.gitignore` exclusions, along with lack of secure context validation for Web Crypto API (`window.crypto.subtle`) in client-side hashing logic.

**Learning:** Root-level git ignore patterns like `js/config.js` do not match recursively under subdirectories, and files committed before ignore rules are defined remain tracked in Git index. Additionally, using Web Crypto API without checking secure context availability causes silent runtime crashes on insecure connections.

**Prevention:** Always use recursive patterns in `.gitignore` (e.g., `**/js/config.js`), run `git rm --cached` on configuration files to clear them from Git tracking index, and add defensive runtime checks for `window.crypto.subtle` before invoking SHA-256 hash digests.
