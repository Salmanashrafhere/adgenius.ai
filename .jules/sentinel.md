## 2025-05-14 - IDOR Vulnerability in API Routes
**Vulnerability:** Insecure Direct Object Reference (IDOR) in `app/api/campaigns/route.js`.
**Learning:** The API route was fetching data based on a `userId` query parameter without verifying if the requester was actually that user. The use of `supabaseAdmin` bypassed RLS, making this check even more critical in the application logic.
**Prevention:** Always verify the authenticated user's ID against any requested resource identifiers in server-side logic when bypassing database-level security (RLS). Use `@supabase/ssr` to securely retrieve the session user in Next.js 15.
