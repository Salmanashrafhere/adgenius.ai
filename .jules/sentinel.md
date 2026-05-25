## 2025-05-25 - [Fixing IDOR and Auth in API Routes]
**Vulnerability:** API routes (`/api/campaigns`, `/api/generate`, `/api/generate-images`) were trusting user-provided `userId` or lacking authentication entirely, allowing for IDOR and unauthorized resource consumption.
**Learning:** Next.js App Router API routes must explicitly verify user sessions using server-side Supabase clients and `cookies()` to prevent client-side manipulation of identifiers.
**Prevention:** Always use `supabase.auth.getUser()` on the server to retrieve the authenticated user's ID rather than accepting it from request parameters or the body.
