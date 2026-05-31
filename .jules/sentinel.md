## 2026-05-31 - Stored XSS and Hardcoded Secrets in "Secured" Version
**Vulnerability:** Despite being marked as "secured" (v2_secured), the application contained a hardcoded Firebase API Key and multiple stored XSS vectors in data-driven UI components (client search, client list, chef board). Unsanitized data from the database was being directly interpolated into `innerHTML` and `onclick` attributes.
**Learning:** Security is iterative; "secured" labels can provide a false sense of safety. Output escaping with `escapeHtml` is a critical baseline, but it is insufficient for securing inline event handlers. Using string interpolation in `onclick` attributes (e.g., `onclick="app.doSomething('${user_input}')"`) allows for JavaScript injection if the input contains a single quote, even if other HTML tags are escaped.
**Prevention:**
1. Never commit secrets to the repository, even in "reference" or "secured" folders; always use environment variables or placeholders.
2. Consistently apply output sanitization to ALL dynamic data injections in the DOM.
3. Refactor inline event handlers to use `data-*` attributes (e.g., `data-id`, `data-name`) and access them via `this.dataset` in the handler function, effectively decoupling data from executable code paths.
