## 2025-05-15 - Campaign Data IDOR Vulnerability
**Vulnerability:** The `/api/campaigns` endpoint allowed any user to fetch campaign data for any other user by simply providing their `userId` as a query parameter.
**Learning:** The API route was relying on `supabaseAdmin` to fetch data and didn't perform any session-based authorization checks, trusting the client-provided `userId`.
**Prevention:** Always verify the authenticated user's session on the server side using `supabase.auth.getUser()` and ensure it matches the requested resource's owner before using an admin client to bypass Row Level Security.
