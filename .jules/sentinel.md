# Sentinel Security Journal

## 2026-10-31 - Git Tracking of Subdirectory Configs and Template Credentials
**Vulnerability:** Hardcoded production Firebase API keys and credentials were tracked in Git inside `v2_secured/js/config.js` and `template ore.html`.
**Learning:** A root-level `.gitignore` entry of `js/config.js` does not automatically match `v2_secured/js/config.js` in nested folders. Furthermore, files added to Git before being ignored remain tracked until explicitly removed with `git rm --cached`. HTML templates often get overlooked when stripping credentials out of standard config files.
**Prevention:** Use recursive gitignore patterns such as `**/js/config.js` to cover subdirectories, enforce pre-commit audits on git-tracked files using automated secret scanning scripts, and audit template files to use placeholder dummy tokens instead of live production credentials.
