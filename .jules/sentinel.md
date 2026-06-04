## 2025-05-15 - IDOR in API routes via user-controlled ID

**Vulnerability:** Insecure Direct Object Reference (IDOR) in `app/api/campaigns/route.js` and `app/api/generate/route.js`. The routes relied on a `userId` passed via query parameters or the request body without verifying it against the authenticated session.

**Learning:** Trusting client-provided IDs for authorization is a common Pitfall. Even if a user is authenticated, they could potentially access or create data for other users by manipulating the `userId` in the request.

**Prevention:** Always retrieve the authenticated user's ID directly from a verified server-side session (e.g., `supabase.auth.getUser()`) instead of relying on IDs provided in the request parameters or body.
