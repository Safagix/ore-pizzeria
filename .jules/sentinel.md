## 2026-05-29 - Stored XSS Mitigation in Vanilla JS
**Vulnerability:** Several components used `innerHTML` to render unsanitized user data from Firebase, allowing Stored XSS. Additionally, `onclick` handlers were using string interpolation of variables, creating attribute-based injection risks.
**Learning:** In legacy Vanilla JS apps, escaping HTML for `innerHTML` is only half the battle. Inline event handlers (`onclick`, etc.) are also dangerous injection points if they interpolate variables directly into the attribute string.
**Prevention:** 1. Implement a robust `escapeHtml` utility. 2. Refactor inline event handlers to use `data-*` attributes and the `dataset` API within the handler to safely pass values without string interpolation in the HTML attribute itself.
