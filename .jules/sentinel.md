## 2026-01-24 - Context-Aware Output Encoding for XSS Prevention
**Vulnerability:** Stored Cross-Site Scripting (XSS) via user-provided strings (customer names, movement descriptions) rendered directly into the DOM using `innerHTML`.
**Learning:** Naive application of HTML escaping to JavaScript event handler attributes (like `onclick`) can cause both functional bugs (syntax errors) and security failures, as browsers decode HTML entities in attributes before executing the JavaScript.
**Prevention:** Always use context-aware encoding. For text content in HTML, use HTML entity encoding. For data in JavaScript contexts, use proper JS string escaping or avoid inline handlers entirely.
