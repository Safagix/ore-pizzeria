# Sentinel's Journal - Critical Security Learnings

## 2025-05-15 - Secret Exposure in Git Index
**Vulnerability:** A configuration file (`v2_secured/js/config.js`) containing sensitive Firebase API keys was tracked by Git, even though it was listed in `.gitignore`.
**Learning:** Adding a file to `.gitignore` does not remove it from the Git index if it was already committed. Files must be explicitly removed using `git rm --cached`.
**Prevention:** Use `git ls-files` to audit for sensitive files that might be unintentionally tracked.

## 2025-05-15 - Broken Hash for Service Role
**Vulnerability:** The pre-calculated SHA-256 hash for the 'service' role in the secured version was incorrect, rendering the role inaccessible.
**Learning:** The hash was likely generated from a string with a trailing newline or a different encoding than what `crypto.subtle` produces in the browser.
**Prevention:** Always verify pre-calculated hashes against the actual output of the implementation's hashing function (e.g., `window.crypto.subtle`) using the expected user input.
