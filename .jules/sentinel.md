# Sentinel's Journal

## 2024-08-05 - Git Tracking of Sensitive Config Files
**Vulnerability:** Hardcoded API keys and Firebase credentials were being tracked in version control because the subdirectory config files (like `v2_secured/js/config.js`) were not excluded by root-level `.gitignore` rules (which only targeted `js/config.js` instead of using a recursive pattern).
**Learning:** Root-level ignore patterns targeting specific files do not automatically apply to files with the same name in subdirectories if those subdirectory files were committed before the ignore rule was established or if the ignore pattern is not recursive.
**Prevention:** Use recursive ignore patterns like `**/js/config.js` in `.gitignore` and audit tracked files using `git ls-files` to remove sensitive files from Git cache (`git rm --cached`).
