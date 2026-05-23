# Sentinel Security Journal - Ore Pizzeria

## 2026-05-23 - Mitigation of XSS via HTML Escaping and Dataset Refactoring
**Vulnerability:** Multiple Cross-Site Scripting (XSS) vectors were present where user-controlled data (customer names, movement descriptions, product notes) were injected directly into the DOM using `innerHTML` without sanitization.
**Learning:** In legacy Vanilla JS applications using template literals for UI rendering, simple string interpolation of data retrieved from a database (even a trusted one like Firebase) is a high-risk pattern. Furthermore, refactoring `onclick` handlers to use `data-*` attributes and `this.dataset` provides a cleaner and more secure way to pass parameters than string concatenation within HTML attributes.
**Prevention:** Always use a robust HTML escaping utility for any data rendered via `innerHTML`. Prefer `textContent` when possible, but if `innerHTML` is necessary for structure, sanitize all data points. Replace dangerous inline script interpolation in event handlers with `dataset` access.
