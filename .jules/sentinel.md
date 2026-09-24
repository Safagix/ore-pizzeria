## 2025-05-18 - Git tracking of subfolder configuration files
**Vulnerability:** Hardcoded API keys in `v2_secured/js/config.js` were tracked in Git despite `js/config.js` being listed in root `.gitignore`.
**Learning:** Root level `.gitignore` paths without glob patterns (e.g. `js/config.js`) only ignore top-level paths, and previously committed files are not ignored automatically.
**Prevention:** Use recursive glob patterns like `**/js/config.js` in `.gitignore` and audit git tracked files using `git ls-files` to ensure sensitive configuration files in subdirectories are removed from source control.
