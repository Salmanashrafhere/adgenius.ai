## 2026-06-16 - [IDOR in Campaign API]
**Vulnerability:** The `/api/campaigns` route accepted a `userId` query parameter and returned all campaigns for that user without verifying if the requesting user was the owner of the data.
**Learning:** Even when using a server-side Supabase client (`supabaseAdmin`) that bypasses RLS, it is crucial to implement manual session verification to ensure users can only access their own data.
**Prevention:** Always verify the authenticated user's ID against any user-provided identifiers (`userId`, `id`, etc.) in API routes before performing database operations.
