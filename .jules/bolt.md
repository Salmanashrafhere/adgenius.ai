# Bolt's Performance Journal

## 2025-01-24 - Initializing Journal
**Learning:** Initializing the performance journal to track optimizations in the AdGenius SaaS application.
**Action:** Use this journal to document critical performance findings and patterns.

## 2025-01-24 - Payload Optimization Pattern
**Learning:** The `GET /api/campaigns` route currently fetches full `ad_creatives` objects just to display a count on the dashboard. This significantly increases payload size as the number of ads grows.
**Action:** Use selective column fetching and server-side transformation to return only necessary data.
