# Sentinel's Security Journal

## 2025-05-14 - Sensitive Configuration Tracked by Git
**Vulnerability:** The configuration file `v2_secured/js/config.js`, containing real Firebase API keys and project credentials, was tracked by version control despite a root-level `.gitignore` entry intended to exclude it.
**Learning:** Root-level `.gitignore` rules (e.g., `js/config.js`) do not automatically exclude files with the same name in subdirectories unless they are already tracked or if the rule specifically uses a recursive pattern.
**Prevention:** Use recursive patterns like `**/js/config.js` in `.gitignore` to ensure consistent exclusion of sensitive configuration files across the entire directory structure.

## 2025-05-14 - Incorrect Authentication Hash for Service Role
**Vulnerability:** The pre-calculated SHA-256 hash for the 'service' role (PIN '1111') in `v2_secured/js/app.js` was incorrect, preventing legitimate access to that role.
**Learning:** Hashes pre-calculated in different environments (e.g., shell with `echo` vs. browser input) can mismatch if trailing newline characters are inadvertently included in the input string.
**Prevention:** Always verify pre-calculated hashes against the specific environment's input handling and ensure the hashing process is consistent with how the application processes user input.
