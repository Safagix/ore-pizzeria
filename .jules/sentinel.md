## 2025-01-24 - [Hashed Credentials and XSS Mitigation]
**Vulnerability:** Hardcoded credentials in `js/app.js` and Stored XSS in multiple dashboard rendering functions.
**Learning:** Naive authentication logic using plain-text PINs in client-side code is a high risk for internal sabotage. Lack of output encoding when using `innerHTML` to display user-provided data allows for malicious script execution.
**Prevention:** Use cryptographic hashes (SHA-256) for any credential storage/comparison and always sanitize user-provided data using an `escapeHtml` utility before injecting it into the DOM.
