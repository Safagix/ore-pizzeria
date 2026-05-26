# Sentinel's Journal - Critical Security Learnings

## 2026-01-24 - XSS in Inline Event Handlers
**Vulnerability:** Cross-Site Scripting (XSS) via attribute injection in inline `onclick` handlers.
**Learning:** Standard HTML escaping (e.g., `&lt;`) is insufficient and can be functionally breaking when data is interpolated directly into JavaScript string literals within HTML attributes (like `onclick`). Browsers decode these entities *before* execution, allowing an attacker to break out of the string literal (e.g., using `'); alert(1); //`).
**Prevention:** Avoid interpolating dynamic data into inline script attributes. Instead, use `data-*` attributes to store the data and access it via `this.dataset` within the handler function. This ensures data is handled as a property rather than part of the executable script string.
