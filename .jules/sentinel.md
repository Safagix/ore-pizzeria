# Sentinel's Security Journal 🛡️

## 2025-05-15 - Exposure of Firebase Configuration and Weak Authentication Logic
**Vulnerability:** Hardcoded Firebase API keys and secrets in `v2_secured/js/config.js` were tracked by version control. Additionally, the SHA-256 hash for the 'service' role in `v2_secured/js/app.js` was incorrect, and failed login hashes were leaked to the console.
**Learning:** Even "secured" versions of an application can accidentally leak sensitive configuration files if Git tracking isn't explicitly audited. Root-level `.gitignore` rules must be robust enough to cover subdirectories recursively.
**Prevention:** Use recursive patterns in `.gitignore` (e.g., `**/js/config.js`) and perform a `git ls-files` audit after implementing ignore rules to ensure no sensitive files are already tracked. Always verify that security-critical hashes match expected values across all versions of the app and avoid logging sensitive data like authentication hashes.
