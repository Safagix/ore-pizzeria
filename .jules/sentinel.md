# Sentinel Security Journal - Ore Pizzeria

## 2025-01-24 - Tracking of Sensitive Configuration Files
**Vulnerability:** The configuration file `v2_secured/js/config.js` containing real Firebase API keys and credentials is being tracked by Git, despite `.gitignore` having a rule for `js/config.js`.
**Learning:** Git ignore rules are not recursive by default if they don't use the `**/` pattern, or if the file was already tracked before the rule was added. In this case, `v2_secured/js/config.js` escaped the `js/config.js` rule.
**Prevention:** Use recursive patterns like `**/js/config.js` in `.gitignore` and audit tracked files regularly using `git ls-files`.

## 2025-01-24 - Incorrect Authentication Hashes
**Vulnerability:** The pre-calculated SHA-256 hash for the 'service' role in `v2_secured/js/app.js` is incorrect, preventing legitimate login.
**Learning:** Manual calculation of hashes can lead to errors (e.g., including a newline character in the hash input).
**Prevention:** Use a script to generate hashes and verify them against the actual authentication logic during development.
