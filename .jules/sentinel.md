# Sentinel's Security Journal

## 2025-06-20 - IDOR in API Routes
**Vulnerability:** API routes like `/api/campaigns` were accepting a `userId` from query parameters and using it directly to query data via `supabaseAdmin`, without verifying if the requesting user is actually that user.
**Learning:** Using `supabaseAdmin` (service role) bypasses Row Level Security (RLS), making manual session verification mandatory. The application was relying on the client to provide the correct `userId`, which is easily manipulated.
**Prevention:** Always use a session-aware Supabase client in API routes and derive the `userId` from the authenticated session rather than request parameters.
