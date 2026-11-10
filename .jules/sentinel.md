## 2026-05-16 - Hardcoded Firebase Credentials in Subfolders and Templates

**Vulnerability:** Real Firebase production API keys and project settings were tracked in git inside `v2_secured/js/config.js` and `template ore.html`.
**Learning:** The existing `.gitignore` entry was written as `js/config.js` instead of `**/js/config.js`, which only ignored config files at the root directory and allowed `v2_secured/js/config.js` to be checked in. Furthermore, git will continue tracking previously staged files even if an ignore rule is later applied unless explicitly untracked via `git rm --cached`.
**Prevention:** Use recursive path patterns in `.gitignore` (e.g. `**/js/config.js`) for secret-bearing files across subdirectories, untrack cached instances using `git rm --cached`, and audit repository templates to ensure placeholder values are used instead of actual credentials.
