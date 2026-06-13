## 2026-06-13 - Fix IDOR in Campaign Fetch API
**Vulnerability:** The `/api/campaigns` endpoint was vulnerable to Insecure Direct Object Reference (IDOR). It retrieved campaign data based on a `userId` query parameter without verifying if the authenticated user matches that ID.
**Learning:** Even if a request contains a valid session token, endpoints that fetch data based on query parameters must explicitly authorize that the requested resource belongs to the session user.
**Prevention:** Always implement server-side authorization checks that compare the `userId` of the requested resource against the authenticated user's ID from `supabase.auth.getUser()`.
