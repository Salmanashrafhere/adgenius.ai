## 2025-05-28 - [IDOR in API Routes]
**Vulnerability:** API routes (`/api/campaigns`, `/api/generate`) were accepting `userId` from request parameters or body without verifying it against the authenticated session, allowing any user to access or create data for others.
**Learning:** Client-side authentication state is easily spoofed; server-side routes must independently verify the user's identity using secure session cookies.
**Prevention:** Always use server-side Supabase clients with `@supabase/ssr` to retrieve the authenticated user from cookies via `supabase.auth.getUser()`.
