## 2024-05-24 - [Git Tracking of Sensitive Config & Incorrect Auth Hashes]
**Vulnerability:** Sensitive configuration file containing Firebase API keys was tracked by Git, and the authentication hash for the 'service' role was incorrect due to a trailing newline character in the pre-calculation.
**Learning:** Initial .gitignore rules (e.g., 'js/config.js') do not automatically apply to subdirectories or files already tracked by Git.
**Prevention:** Use recursive patterns in .gitignore (e.g., '**/js/config.js') and audit tracked files with 'git ls-files' regularly.
