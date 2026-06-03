## 2025-05-15 - [IDOR Vulnerability in API Routes]
**Vulnerability:** API routes (`/api/campaigns`, `/api/generate`) were accepting `userId` directly from query parameters or request bodies without server-side verification. This allowed any authenticated user to potentially access or generate data for any other user's ID (IDOR).
**Learning:** The application was using `supabaseAdmin` to perform database operations, which bypasses Row Level Security (RLS). When RLS is bypassed, the application logic MUST explicitly verify that the requesting user owns the resource.
**Prevention:** Always retrieve the `userId` from a verified server-side session using `supabase.auth.getUser()` (via `@supabase/ssr`) instead of trusting client-provided identifiers.
