# Sentinel Security Journal 🛡️

## 2025-05-14 - Incorrect Authentication Hash Calculation
**Vulnerability:** The pre-calculated SHA-256 hash for the 'service' role was incorrect, preventing legitimate login.
**Learning:** The previous hash was calculated using a string with a trailing newline character (likely from `echo "1111" | sha256sum`), whereas browser input does not include such characters.
**Prevention:** Always use `echo -n` or dedicated tools to calculate hashes for browser-based inputs to ensure exact character matching.

## 2025-05-14 - Sensitive Configuration Leaked in Git
**Vulnerability:** Firebase credentials in `v2_secured/js/config.js` were tracked by Git despite a root-level `.gitignore` rule for `js/config.js`.
**Learning:** Root-level ignore rules for specific paths do not automatically cover identically named files in subdirectories if they were already tracked before the rule was established.
**Prevention:** Use recursive patterns like `**/js/config.js` in `.gitignore` and audit tracked files using `git ls-files` to ensure sensitive configurations are not accidentally committed.
