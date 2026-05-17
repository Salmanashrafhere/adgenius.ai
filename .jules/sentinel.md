## 2025-01-24 - [Security Headers]
**Vulnerability:** Missing security headers (X-Frame-Options, CSP, etc.) making the app vulnerable to clickjacking and other attacks.
**Learning:** Next.js applications often miss these baseline security headers if not explicitly configured in middleware or next.config.js.
**Prevention:** Always implement a standard set of security headers in middleware to ensure all responses are protected by default.
