# Sentinel Security Journal - Critical Learnings

## 2026-08-07 - Subdirectory Config Leakage in Git Tracking
**Vulnerability:** Hardcoded API credentials leaked via `v2_secured/js/config.js` because root-level `.gitignore` rules (e.g. `js/config.js`) do not match subdirectories unless specified recursively as `**/js/config.js`. Furthermore, files already tracked in git ignore gitignore patterns.
**Learning:** Adding a root-level path to `.gitignore` is insufficient if identically named files are committed in subdirectories before the rule was added or if recursive wildcards are omitted.
**Prevention:** Always use recursive patterns like `**/js/config.js` in `.gitignore` and run `git rm --cached` to prune previously tracked configuration files.

## 2026-08-07 - Multi-Environment SHA-256 Hash Prefix Mismatch
**Vulnerability:** The pre-calculated SHA-256 hash for the 'service' role in `v2_secured` was incorrect, causing authentication bypass failures/denial of service. It shared a 32-character prefix (128 bits) with the correct hash.
**Learning:** Mismatches sharing exactly 32 characters in a SHA-256 string can happen when character set/encoding or invisible trailing characters (like newlines) differ during pre-calculation across different scripting/CLI environments.
**Prevention:** Always verify hashes inside the exact runtime environment (the browser web console or headless browser tests) and cross-reference with clean string inputs without trailing newlines.
