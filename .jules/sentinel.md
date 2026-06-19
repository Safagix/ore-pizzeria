## 2025-05-14 - Hardcoded Firebase Credentials in Secured Directory
**Vulnerability:** Hardcoded Firebase API keys and configuration were found in `v2_secured/js/config.js` and were being tracked by Git.
**Learning:** Root-level `.gitignore` rules (e.g., `js/config.js`) do not automatically prevent tracking of files with the same name in subdirectories if they were already committed.
**Prevention:** Use recursive ignore patterns like `**/js/config.js` and regularly audit tracked files with `git ls-files` to ensure no sensitive files are accidentally included.

## 2025-05-14 - Incorrect Authentication Hash for Service Role
**Vulnerability:** The SHA-256 hash for the 'service' role in `v2_secured/js/app.js` was incorrect, likely generated with a trailing newline character, preventing legitimate login.
**Learning:** Hashes generated via CLI tools often include trailing newlines by default, which differ from hashes generated from browser input strings.
**Prevention:** Always verify hashes using the same environment/method (Web Crypto API) that will be used in production to ensure consistency.
