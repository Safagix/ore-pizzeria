## 2025-01-24 - Widespread Stored XSS Mitigation
**Vulnerability:** Widespread Stored XSS risks due to the use of `innerHTML` with unsanitized user-controlled data (client names, notes, movement descriptions) and dangerous inline `onclick` handlers with string interpolation.
**Learning:** In Vanilla JS applications using template literals for rendering, sanitization must be applied at every injection point. Inline event handlers are especially risky when they interpolate variables that could contain quotes or malicious scripts.
**Prevention:** Always use a sanitization utility like `escapeHtml` for any dynamic text and prefer `data-*` attributes with `this.dataset` for passing values to event handlers instead of string interpolation.
