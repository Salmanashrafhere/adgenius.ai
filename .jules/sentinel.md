## 2025-06-14 - Fix IDOR in Campaigns API
**Vulnerability:** Insecure Direct Object Reference (IDOR) in `app/api/campaigns/route.js`. The endpoint allowed fetching any user's campaigns by providing their `userId` in the query string without session verification.
**Learning:** Even if the database (Supabase) has RLS, using a service role key (as `supabaseAdmin` does) bypasses it. Therefore, explicit server-side authorization checks are mandatory in API routes that use administrative clients.
**Prevention:** Always verify the user's session and identity using `supabase.auth.getUser()` from `@supabase/ssr` before processing requests that involve user-specific data, especially when using elevated privileges.
