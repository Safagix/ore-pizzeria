## 2025-01-24 - Widespread Stored XSS in POS System
**Vulnerability:** Widespread Stored XSS due to direct injection of database-sourced strings into the DOM via `innerHTML`.
**Learning:** The application extensively uses template literals and `innerHTML` for rendering data. Any user-controlled field (customer names, notes, movement descriptions) saved to the database could execute malicious scripts on other users' browsers (Cajeros, Chef, Admin).
**Prevention:** Implement a central `escapeHtml` utility and consistently apply it to all dynamic content before DOM injection. Transition from inline `onclick` string interpolation to `data-*` attributes and `this.dataset` for safer event handling.
