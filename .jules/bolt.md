# Bolt's Performance Journal

## 2026-05-24 - [Payload Optimization for Campaign Fetching]
**Learning:** Fetching all columns of nested relations (like `ad_creatives` in the `campaigns` list) significantly increases JSON payload size and database memory usage for data the dashboard doesn't need (it only needs the count).
**Action:** Use Supabase's selective column fetching to only retrieve IDs for count purposes, or use aggregate functions if available, while maintaining a `adsCount` property for the frontend.
