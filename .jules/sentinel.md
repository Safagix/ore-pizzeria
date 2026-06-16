# Sentinel Security Journal 🛡️

## 2025-06-16 - Configuration Leak and Auth Fix
**Vulnerability:** Hardcoded Firebase credentials were being tracked in Git in `v2_secured/js/config.js`, and authentication hashes were being leaked to the browser console during failed login attempts in `v2_secured/js/app.js`. Additionally, the hash for the 'service' role was incorrect, preventing legitimate login.
**Learning:** Even "secured" versions of a project can accidentally include sensitive files if they were committed before `.gitignore` rules were established or if the rules were too specific. Debug logs can also persist into production-ready code.
**Prevention:** Use recursive patterns in `.gitignore` (e.g., `**/js/config.js`). Regularly audit tracked files using `git ls-files`. Always remove debug logging before finalizing security enhancements.
