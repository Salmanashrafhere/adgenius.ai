## 2025-05-14 - [API Optimization with Pagination and Total Stats]
**Learning:** When optimizing an API to return a limited subset of results (e.g., limit=5 for a "recent items" list), client-side statistics derived from that list will become inaccurate.
**Action:** Always return aggregate totals (like totalCount) separately in the API response when implementing pagination or limiting, and update the frontend to use these totals instead of calculating from the result set.

## 2025-05-14 - [Supabase Count Query Optimization]
**Learning:** Supabase's `{ count: 'exact', head: true }` is an efficient way to get record counts without fetching any data.
**Action:** Use this pattern for aggregate statistics in API routes to keep response times low and payload sizes small.
