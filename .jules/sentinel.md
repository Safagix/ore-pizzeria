# Sentinel Security Journal

## 2026-08-09 - Git Tracking of Sensitive Configuration Files
**Vulnerability:** The application's sensitive Firebase configuration file (`v2_secured/js/config.js`) containing a real, production-like Firebase API Key and database URL was tracked and committed to the Git repository, despite a root-level `.gitignore` rule attempting to exclude `js/config.js`.
**Learning:** Root-level `.gitignore` rules (e.g., `js/config.js`) are not recursive and do not automatically cover identically named files in subdirectories (like `v2_secured/js/config.js`). Furthermore, adding ignore rules after a file has already been committed and tracked has no effect unless the file is explicitly untracked using `git rm --cached`.
**Prevention:** Always use recursive patterns in `.gitignore` (e.g., `**/js/config.js`) to capture nested configurations across the entire codebase. Ensure any previously tracked sensitive files are cleared from the Git cache using `git rm --cached` immediately.

## 2026-08-09 - Incorrect Pre-calculated PIN Hashes for Service Role
**Vulnerability:** The pre-calculated SHA-256 hash for the 'service' role (PIN '1111') in `v2_secured/js/app.js` was incorrect, causing the system to reject all valid PIN entries for this role.
**Learning:** The hash mismatch occurred because the PIN string was hashed with a trailing newline character (likely from terminal shell utilities like `echo` which appends `\n` by default unless invoked with `-n`). This created a 256-bit hash mismatch, locking out service operators during client-side authentication.
**Prevention:** When pre-calculating hashes, ensure input is sanitized of any whitespace or newline characters, and use clean browser-based or verified CLI tools (`echo -n "1111" | shasum -a 256`) to guarantee exact matching with browser native inputs.
