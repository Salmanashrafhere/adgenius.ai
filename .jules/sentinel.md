## 2025-05-15 - Fixed IDOR in Campaigns API
**Vulnerability:** The `/api/campaigns` endpoint relied on a client-provided `userId` query parameter to filter campaigns. An attacker could potentially access any user's campaigns by providing their `userId`.
**Learning:** API routes using `supabaseAdmin` bypass Row Level Security (RLS), making manual server-side session and identity verification critical.
**Prevention:** Always retrieve the `userId` from the authenticated session using `supabase.auth.getUser()` with a session-aware client (e.g., via `@supabase/ssr`) instead of trusting client-provided parameters.
