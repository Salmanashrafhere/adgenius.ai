## 2026-07-05 - Fixed IDOR in Campaign API Routes
**Vulnerability:** API routes were trusting client-provided `userId` for data fetching and creation.
**Learning:** Next.js API routes must verify the authenticated user's session on the server using `@supabase/ssr` instead of relying on client-side identifiers.
**Prevention:** Always use server-side session verification (`supabase.auth.getUser()`) to determine the user context in sensitive API endpoints.
