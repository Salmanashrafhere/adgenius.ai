## 2025-05-14 - [Critical IDOR Vulnerability in Campaigns API]
**Vulnerability:** The `GET /api/campaigns` route accepted a `userId` as a query parameter and used it to filter campaigns without verifying if the `userId` matched the authenticated user's session. This allowed any authenticated (or even unauthenticated) user to view any other user's campaigns by providing their `userId`.

**Learning:** Relying on client-provided identifiers for sensitive data retrieval is a classic IDOR (Insecure Direct Object Reference) pattern. In Next.js 15 with Supabase, it is essential to use server-side session verification via `@supabase/ssr` and `cookies()` to obtain the truth about the user's identity.

**Prevention:** Always retrieve the `user.id` from the authenticated session (e.g., using `supabase.auth.getUser()`) on the server side and use that ID for database queries. Never trust a user-provided ID for ownership verification.
