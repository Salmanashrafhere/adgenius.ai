## 2026-06-12 - [IDOR vulnerability in campaigns API]
**Vulnerability:** The `app/api/campaigns/route.js` endpoint accepted a `userId` query parameter and fetched data using `supabaseAdmin` without verifying if the requested `userId` belonged to the authenticated user. This allowed any user to access campaigns and ad creatives of any other user by simply changing the `userId` in the request.
**Learning:** Using a service role (`supabaseAdmin`) bypasses Row Level Security (RLS). When using it in API routes, manual authorization checks are mandatory to prevent IDOR.
**Prevention:** Always verify the user's session using `supabase.auth.getUser()` and compare the session `userId` with the requested resources before performing database operations with a service role.
