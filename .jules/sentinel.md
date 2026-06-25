## 2025-05-14 - Hardcoded Secrets in v2_secured
**Vulnerability:** Firebase configuration with real API keys was committed to the repository in `v2_secured/js/config.js`. While `js/config.js` was ignored, the versioned secured directory was missed.
**Learning:** Hardcoded credentials can easily slip into subdirectories if `.gitignore` patterns are not recursive or if files are committed before the ignore rule is established.
**Prevention:** Use recursive ignore patterns (e.g., `**/js/config.js`) and audit tracked files periodically using `git ls-files`.

## 2025-05-14 - Incorrect Authentication Hashes
**Vulnerability:** The 'service' role hash in `v2_secured/js/app.js` was incorrect, preventing legitimate login. Additionally, a debug `console.log` leaked generated hashes to the browser console.
**Learning:** Security fixes can introduce functional bugs (broken auth) if not verified against the intended input. Debug logs in authentication flows are a liability.
**Prevention:** Always verify authentication flows after changing hash logic and ensure no sensitive data is logged even in "debug" mode.
