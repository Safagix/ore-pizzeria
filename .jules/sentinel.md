## 2025-05-20 - Git tracking of sensitive config files in subdirectories

**Vulnerability:**
Hardcoded Firebase API keys and credentials were committed in `v2_secured/js/config.js` because the `.gitignore` rule was top-level `js/config.js` rather than recursive `**/js/config.js`.

**Learning:**
Root-level `.gitignore` rules targeting specific paths (e.g. `js/config.js`) do not prevent tracking of identically named files in subdirectories (like `v2_secured/js/config.js`) if created later or omitted from glob patterns. Furthermore, `.gitignore` does not automatically untrack files that have already been committed.

**Prevention:**
Always use glob patterns like `**/js/config.js` for configuration files that could exist across multiple subdirectories/modules, and run `git ls-files` during audits to verify tracked files against secrets rules.
