## 2025-05-20 - [IDOR in API Endpoints]
**Vulnerability:** The `/api/campaigns` and `/api/generate` endpoints relied on client-provided `userId` for database queries and record creation.
**Learning:** This is a classic IDOR vulnerability where an attacker could access or modify other users' data by changing the ID in the request.
**Prevention:** Always retrieve the user ID from the authenticated session (via `supabase.auth.getUser()`) on the server side instead of trusting client-side request parameters.
