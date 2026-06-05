## 2025-06-05 - [IDOR in API Routes]
**Vulnerability:** API routes were accepting `userId` from query parameters or request bodies without verifying it against the authenticated session.
**Learning:** In Next.js App Router with Supabase, relying on client-provided IDs for data operations leads to IDOR vulnerabilities. `supabaseAdmin` bypasses RLS, making this especially dangerous.
**Prevention:** Always retrieve the `userId` from a verified server-side session using `supabase.auth.getUser()` when performing operations on user-specific resources.
