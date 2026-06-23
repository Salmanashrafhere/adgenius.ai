## 2025-06-23 - IDOR in campaigns API
**Vulnerability:** Insecure Direct Object Reference (IDOR) via `userId` query parameter in `/api/campaigns`.
**Learning:** Using `supabaseAdmin` in API routes bypasses Row Level Security (RLS), making it critical to manually verify user identity. Relying on client-provided IDs for filtering is insecure.
**Prevention:** Always use a session-aware Supabase client (e.g., via `@supabase/ssr`) and retrieve the authenticated user's ID server-side using `supabase.auth.getUser()`. Standardize this with a `createClient` helper.
