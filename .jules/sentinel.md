## 2025-03-01 - Git Tracking of Nested Configuration Secrets
**Vulnerability:** A configuration file containing real API keys (`v2_secured/js/config.js`) was tracked in Git despite `.gitignore` having a rule for `js/config.js`.
**Learning:** Root-level path rules in `.gitignore` without leading slashes or recursive wildcards do not apply across nested subdirectories, and files committed prior to `.gitignore` rule additions remain tracked until removed from index via `git rm --cached`.
**Prevention:** Use recursive patterns such as `**/js/config.js` in `.gitignore` and run `git ls-files` during security audits to verify no configuration files are tracked in version control.
