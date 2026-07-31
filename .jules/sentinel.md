# Sentinel Security Journal

## 2026-07-31 - Git Tracking of Sensitive Config Files & Hardcoded Credentials Leak
**Vulnerability:** Active Firebase credentials and API keys were exposed in template ore.html, and the configuration file v2_secured/js/config.js was actively tracked in Git despite being in .gitignore. Furthermore, .gitignore used a non-recursive pattern which did not exclude configs in subdirectories.
**Learning:** If a file is added to Git tracking before an ignore rule is defined, Git will continue tracking it regardless of any subsequent .gitignore patterns. Also, standard root-level paths in .gitignore do not recursively apply to subdirectories unless a wildcard pattern like **/ is used.
**Prevention:** Always untrack sensitive config files using 'git rm --cached' and use recursive directory wildcard patterns (like **/js/config.js) in .gitignore to consistently protect all subdirectories.
