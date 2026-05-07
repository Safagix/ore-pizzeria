# Sentinel Journal - Ore Pizzeria

## 2026-01-23 - Initial Security Hardening
**Vulnerability:** Hardcoded plaintext PINs in client-side code.
**Learning:** Storing secrets in plaintext on the client side allows any user with browser access to discover them via DevTools.
**Prevention:** Use cryptographic hashing (e.g., SHA-256) and salt if possible to store a non-reversible representation of the secret.

## 2026-05-07 - Web Crypto API and Secure Contexts
**Vulnerability:** Application breakage on non-secure origins (non-localhost HTTP).
**Learning:** The browser's Web Crypto API (`crypto.subtle`) is only available in secure contexts. Relying on it for client-side authentication can lead to complete login failure on certain deployments.
**Prevention:** Always check for API availability before use and provide a clear fallback or helpful error message to the user.
