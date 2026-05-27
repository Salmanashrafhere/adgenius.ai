
## 2026-05-27 - [IDOR Prevention in Next.js API Routes]
**Vulnerability:** API routes were trusting user-provided `userId` from request bodies or query parameters to filter or associate data, allowing any user to access or manipulate data belonging to others.
**Learning:** In Next.js (App Router), relying on client-provided IDs is unsafe even with client-side authentication.
**Prevention:** Always use server-side session verification via `supabase.auth.getUser()` from a server-aware client (using `@supabase/ssr`) to establish the identity of the user on every protected API request.
