## 2025-05-14 - IDOR Vulnerability via URL Search Parameters
**Vulnerability:** API routes were trusting `userId` provided in the request body or query string without server-side verification, allowing users to access or modify data belonging to others (IDOR).
**Learning:** In Next.js App Router with Supabase, relying on client-provided IDs is unsafe even if the frontend is "authenticated". The server must independently verify the user's identity via session cookies.
**Prevention:** Use `@supabase/ssr` to create a server-side client that retrieves the authenticated user directly from the session (`supabase.auth.getUser()`) for every sensitive API request.
