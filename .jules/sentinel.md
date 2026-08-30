## 2025-05-18 - Untracking Hardcoded Configuration in Subdirectories
**Vulnerability:** `v2_secured/js/config.js` containing active Firebase API keys was committed to the Git repository, bypassing the root `.gitignore` pattern `js/config.js`.
**Learning:** Target-specific `.gitignore` rules (like `js/config.js`) do not automatically prevent Git from tracking identical filenames in subdirectories (such as `v2_secured/js/config.js`) if added explicitly or before subfolder rules were applied.
**Prevention:** Use recursive glob patterns like `**/js/config.js` in `.gitignore` and audit tracked files using `git ls-files` to ensure sensitive environment configuration files across all subdirectories are untracked.
