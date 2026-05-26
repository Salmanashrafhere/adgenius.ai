## 2025-05-26 - IDOR in Campaign and Generation APIs
**Vulnerability:** The `/api/campaigns` and `/api/generate` endpoints were using `userId` provided in request parameters (query or body) without verifying it against the authenticated session. This allowed any user to access or create campaigns for any other user ID.
**Learning:** Next.js Route Handlers do not automatically secure endpoints based on query parameters. Relying on client-provided IDs for authorization is a classic IDOR (Insecure Direct Object Reference) pattern.
**Prevention:** Always retrieve the user ID from a verified server-side session using `supabase.auth.getUser()` (or equivalent) in API routes. Never trust user-provided IDs for authorization checks.
