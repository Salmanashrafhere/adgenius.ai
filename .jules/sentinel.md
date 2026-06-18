## 2025-05-14 - Broken Access Control via supabaseAdmin in API Routes

**Vulnerability:** API routes were using `supabaseAdmin` (which bypasses Row Level Security) and relying on a client-provided `userId` query parameter for data filtering. This allowed any authenticated (or even unauthenticated in some cases) user to access data belonging to any other user by simply modifying the `userId` in the request.

**Learning:** When using Next.js with Supabase, relying on `supabaseAdmin` for user-specific data fetching is dangerous as it ignores all RLS policies. The server-side code must manually verify the user's identity via session cookies.

**Prevention:** Use a session-aware Supabase client (e.g., via `@supabase/ssr`) and always retrieve the user ID from `supabase.auth.getUser()`. Never trust a user ID provided in query parameters or request bodies for authorization. Use `lib/supabaseServer.js` to create an authenticated client in API routes.
