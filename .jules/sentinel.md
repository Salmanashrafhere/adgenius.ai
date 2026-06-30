## 2026-06-30 - [HIGH] Fix IDOR in Campaign APIs
**Vulnerability:** API routes were trusting client-provided `userId` in query parameters and request bodies, allowing any authenticated user to access or create data for any other user.
**Learning:** Next.js API routes that interact with user-specific data must never trust client-provided user identifiers. Even if middleware handles initial authentication, individual routes must resolve the user identity from the verified session (e.g., via cookies) to prevent IDOR/BOLA.
**Prevention:** Always use `supabase.auth.getUser()` from a session-aware Supabase client (via `@supabase/ssr`) to obtain the current user's ID before performing database operations.
