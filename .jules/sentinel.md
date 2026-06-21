# Sentinel Security Journal

## 2025-05-15 - Hardcoded Secrets and Incorrect Authentication Hashes
**Vulnerability:** Firebase configuration file `v2_secured/js/config.js` containing sensitive API keys is tracked by Git despite being sensitive. Additionally, the 'service' role authentication hash was found to be incorrect, likely due to being hashed with a trailing newline.
**Learning:** Git tracking overrides `.gitignore` rules if the file was committed before the rule was added. In Vanilla JS apps, hardcoded hashes must be carefully verified against browser-standard input (no trailing newlines).
**Prevention:** Use `git ls-files` to audit for sensitive files that might be tracked despite `.gitignore`. Standardize authentication hash generation and verification processes.
