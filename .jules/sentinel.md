## 2026-06-07 - Subdirectory Secret Leakage
**Vulnerability:** Hardcoded Firebase API keys in `v2_secured/js/config.js` were tracked by Git despite a root-level `.gitignore` rule for `js/config.js`.
**Learning:** Root-level `.gitignore` rules do not automatically apply to subdirectories if the files were already committed before the rule was added or if the pattern is not recursive.
**Prevention:** Use recursive patterns like `**/js/config.js` in `.gitignore` and always audit tracked files using `git ls-files` to ensure sensitive configurations are not being indexed.
