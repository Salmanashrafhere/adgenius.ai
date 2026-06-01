## 2025-05-15 - [IDOR in API Routes]
**Vulnerability:** API routes were accepting `userId` from client-side request body/parameters and using it directly in database queries without verifying the session on the server.
**Learning:** Even if the frontend is authenticated, trusting the `userId` passed in the request allows for Insecure Direct Object Reference (IDOR) attacks where a user can impersonate another by changing the ID.
**Prevention:** Always retrieve and verify the user session on the server using `supabase.auth.getUser()` and use that `id` for database operations.
