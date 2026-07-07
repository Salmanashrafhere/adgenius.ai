# Bolt's Performance Journal

## 2025-05-14 - Initial Assessment
**Learning:** The application currently fetches all campaigns and their associated ad creatives in a single request, even for the dashboard summary. This leads to large payloads and unnecessary database strain as the number of campaigns and creatives grows.
**Action:** Implement pagination/limiting and a "lightweight" fetch mode for the campaigns API, and update the frontend to use these optimizations.

## 2025-05-14 - Database Query Anti-pattern
**Learning:** Fetching all campaign IDs into application memory just to perform an `.in()` query for a count on another table is inefficient and can cause performance degradation or memory issues as data scales.
**Action:** Use single-purpose count queries or properly join tables if possible. In Supabase, use `{ count: 'exact', head: true }` on a filtered query to get counts without fetching data.
