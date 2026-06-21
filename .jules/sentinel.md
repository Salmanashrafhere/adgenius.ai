## 2025-05-14 - Insecure Direct Object Reference (IDOR) in API Routes
**Vulnerability:** API routes (like `/api/campaigns`) were using client-provided `userId` from query parameters or request bodies to filter data, allowing any authenticated user to access or modify data belonging to other users.
**Learning:** Relying on client-side identifiers for authorization is insecure. Even if the frontend sends the "correct" ID, a malicious actor can easily manipulate it.
**Prevention:** Always retrieve the user's identity on the server side using the authenticated session (e.g., `supabase.auth.getUser()`) and use that ID for all database queries and authorization checks.
