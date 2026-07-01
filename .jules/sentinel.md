## 2026-07-01 - Trusting Client-Provided Identifiers (IDOR)
**Vulnerability:** API routes (/api/campaigns, /api/generate) accepted a `userId` parameter directly from the client without verifying it against an authenticated session.
**Learning:** Even if authentication is present (login/signup), unless the session is verified on the server for every data-access request, IDOR remains a high risk. The app was relying on localStorage for "identity" which is easily spoofed.
**Prevention:** Always retrieve the user identity from a trusted server-side session (e.g., Supabase SSR cookies) instead of request parameters or body fields.
