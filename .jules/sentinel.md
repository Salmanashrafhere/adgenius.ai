## 2025-05-30 - Broken Object Level Authorization in Campaigns API
**Vulnerability:** The `/api/campaigns` endpoint accepted a `userId` from query parameters and used it to fetch data without verifying if the authenticated user matches that ID.
**Learning:** Next.js API routes often default to client-side data passing for convenience, but any ID passed from the client must be treated as untrusted and verified against a server-side session.
**Prevention:** Always retrieve the user ID from a verified server-side session (e.g., `supabase.auth.getUser()`) instead of trusting request parameters.
