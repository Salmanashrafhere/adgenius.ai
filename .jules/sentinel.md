## 2025-06-02 - Fix IDOR in campaigns API
**Vulnerability:** Insecure Direct Object Reference (IDOR) in `/api/campaigns`. The API was trusting a `userId` query parameter to fetch campaigns, allowing any authenticated (or even unauthenticated) user to fetch anyone's data by changing the ID.
**Learning:** Next.js 15 requires asynchronous handling of cookies when initializing Supabase server-side clients. Centralizing this initialization is crucial for consistent security checks.
**Prevention:** Always retrieve user identity from a verified server-side session (e.g., `supabase.auth.getUser()`) rather than trusting client-provided identifiers in request parameters or bodies.
