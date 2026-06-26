## 2025-05-14 - IDOR Vulnerabilities in Campaign and Generation APIs
**Vulnerability:** API endpoints (`/api/campaigns` and `/api/generate`) were relying on client-provided `userId` parameters to fetch or create data, allowing for Insecure Direct Object Reference (IDOR).
**Learning:** Using `supabaseAdmin` (service role) bypasses RLS, making manual identity verification against the authenticated session mandatory in every sensitive API route.
**Prevention:** Always retrieve the `userId` from `supabase.auth.getUser()` using a session-aware client (e.g., via `@supabase/ssr`) instead of trusting request parameters.
