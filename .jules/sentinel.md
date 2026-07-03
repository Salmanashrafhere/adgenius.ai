## 2025-05-14 - Fix IDOR in API routes via server-side session verification
**Vulnerability:** API routes (`/api/campaigns`, `/api/generate`) were trusting client-provided `userId` parameters, allowing unauthorized access to other users' data (IDOR).
**Learning:** Shared utility files (like `lib/supabase.js`) that are imported by both client and server components cannot have top-level imports of server-only modules like `next/headers`. Doing so breaks client-side bundles.
**Prevention:** Use dynamic imports (`await import('next/headers')`) inside server-only functions within shared utilities. Always verify user identity via `supabase.auth.getUser()` on the server rather than trusting request parameters.
