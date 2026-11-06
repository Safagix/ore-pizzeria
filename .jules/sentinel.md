## 2026-05-16 - Subdirectory Secret Leaks via Incomplete .gitignore Rules
**Vulnerability:** Live Firebase credentials remained committed in `v2_secured/js/config.js` and `template ore.html` despite earlier remediation attempting to hide secrets in `js/config.js`.
**Learning:** Top-level `.gitignore` entries without leading wildcards (e.g. `js/config.js`) do not match identical paths in subdirectories (such as `v2_secured/js/config.js`). Furthermore, git does not untrack previously committed files automatically when ignore rules are added.
**Prevention:** Use recursive path patterns (e.g. `**/js/config.js`) in `.gitignore` and always audit tracked files with `git ls-files` to ensure sensitive files are removed from the index.
