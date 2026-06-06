## 2025-05-14 - IDOR Vulnerability in Campaigns API
**Vulnerability:** The `/api/campaigns` endpoint was trusting a `userId` query parameter to filter data, allowing any user to view campaigns belonging to others.
**Learning:** Blindly trusting client-provided IDs for filtering sensitive data is a classic IDOR pattern. Next.js Route Handlers must verify user identity via server-side sessions.
**Prevention:** Always retrieve the `userId` from a verified server-side session (e.g., `supabase.auth.getUser()`) for any data-fetching or modification operations.
