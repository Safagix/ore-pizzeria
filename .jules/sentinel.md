## 2025-05-14 - Hardcoded Secrets and Inconsistent Git Tracking
**Vulnerability:** Hardcoded Firebase API key found in `template ore.html` and sensitive `config.js` tracked in `v2_secured/js/`.
**Learning:** Root-level `.gitignore` rules (e.g., `js/config.js`) do not automatically prevent tracking of identically named files in subdirectories (like `v2_secured/js/config.js`) if they were committed before the rule was established.
**Prevention:** Always use `git ls-files` to audit what is actually being tracked and use environment variables for secrets, even in templates or "secured" versions.
