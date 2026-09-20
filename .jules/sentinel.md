## 2025-05-20 - Subdirectory Git Tracking of Sensitive Config Files

**Vulnerability:** Hardcoded Firebase API keys and project credentials were tracked in Git inside `v2_secured/js/config.js` and `template ore.html`.

**Learning:** Root-level `.gitignore` rules (like `js/config.js`) do not automatically prevent tracking of identically named files in subdirectories (`v2_secured/js/config.js`) if they were committed prior or not covered by recursive gitignore rules (`**/js/config.js`). Additionally, static HTML templates (`template ore.html`) often get overlooked during secret removal.

**Prevention:** Always use recursive patterns in `.gitignore` (e.g., `**/js/config.js`) for sensitive configuration files across all subdirectories, sanitize template files to use placeholders, and audit tracked files with `git ls-files` to ensure sensitive credentials are not tracked in version control.
