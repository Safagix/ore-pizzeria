# Sentinel Security Journal 🛡️

## 2025-05-14 - Console Hash Leakage in Secured Version
**Vulnerability:** The `login` function in `v2_secured/js/app.js` was found to have a `console.log(pinHash)` statement that leaked authentication hashes to the browser console during login attempts.
**Learning:** Security enhancements (like switching from plaintext PINs to hashes) can be undermined by leftover debug code that exposes the new security tokens.
**Prevention:** Ensure all debug logging is removed from authentication and authorization flows before deployment. Use linting rules to forbid `console.log` in sensitive files.

## 2025-05-14 - Stored XSS in Dashboard and Chef Views
**Vulnerability:** User-provided data (movement descriptions, customer names, and item notes) was being injected directly into the DOM using `innerHTML` without sanitization in `js/app.js`.
**Learning:** Legacy code often relies on `innerHTML` for convenience, creating widespread XSS vectors when data from a shared database (like Firebase) is rendered.
**Prevention:** Always use a sanitization utility like `escapeHtml` when rendering dynamic content, or prefer `textContent` when HTML formatting is not required.
