# Sentinel Security Journal

## 2025-05-14 - IDOR via Client-Provided User IDs
**Vulnerability:** API routes (`/api/campaigns`, `/api/generate`) were trusting a `userId` passed in query parameters or request bodies to filter data or assign ownership, allowing any authenticated (or even unauthenticated) user to access or create data for any other user.
**Learning:** The application was using a global Supabase client singleton on the server which lacked session context. In Next.js, authentication must be explicitly verified on the server using session cookies to prevent spoofing.
**Prevention:** Use `@supabase/ssr` to create a server-side client that automatically handles cookies. Always retrieve the user ID from `supabase.auth.getUser()` on the server and use that for authorization and data filtering.
