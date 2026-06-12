## 2025-05-15 - API Payload Reduction & Memoization
**Learning:** For list views, fetching full related records (e.g., `ad_creatives(*)`) just to show a count is a major bottleneck. Selecting only `id` fields and pre-calculating counts on the server drastically reduces JSON payload size (60-80% in this case).
**Action:** Always audit Supabase joins in API routes; use `ad_creatives(id)` if only the count is needed on the frontend. Use `useMemo` for any O(N) calculations or derived state (like filtering or stats) in components to keep renders snappy.
