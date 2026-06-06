## 2025-05-14 - Incorrect Authentication Hashes and Secret Leakage
**Vulnerability:** Hardcoded Firebase API keys in a tracked `config.js` file and an incorrect SHA-256 hash for the 'service' role ('1111') that likely included a trailing newline during calculation.
**Learning:** Hardcoded secrets in subdirectories can evade root-level `.gitignore` if they were committed before the rule or if the rule isn't recursive. Hashes calculated in a terminal (e.g., `echo '1111' | openssl dgst -sha256`) often include a trailing newline, causing authentication failures in browser environments.
**Prevention:** Use recursive `.gitignore` patterns (e.g., `**/js/config.js`). Use `echo -n` to avoid newlines when generating hashes for browser-based input.
