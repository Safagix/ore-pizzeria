# Sentinel Security Journal

## 2025-05-22 - Stored XSS in Dashboard and Orders
**Vulnerability:** User-controlled data (movement descriptions, customer names) was being injected directly into the DOM using `innerHTML` without sanitization.
**Learning:** Legacy Vanilla JS applications often lack automatic escaping provided by modern frameworks like React or Vue, making them highly susceptible to XSS in every dynamic render loop.
**Prevention:** Always use a centralized sanitization utility like `escapeHtml` for any string being injected via `innerHTML`, or preferably use `textContent` for simple text nodes.
