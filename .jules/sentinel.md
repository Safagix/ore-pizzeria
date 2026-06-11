## 2025-01-24 - Hardcoded Firebase Credentials in "Secured" Version
**Vulnerability:** Hardcoded Firebase API keys and project credentials were found in `v2_secured/js/config.js` and `template ore.html`, despite the `v2_secured` directory being intended as a hardened version.
**Learning:** Root-level ignore rules like `js/config.js` do not automatically protect subdirectories if files were already tracked or if the pattern is not recursive. Labels like "secured" can provide a false sense of security.
**Prevention:** Use recursive ignore patterns (`**/js/config.js`) and enforce the use of environment variables for all sensitive configuration, leveraging scripts like `generate_config.js` to build local config files that remain untracked.
