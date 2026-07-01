## 2026-07-01 - Optimized Campaigns API for list views
**Learning:** Fetching full relational data (like all `ad_creatives`) for list views (Dashboard, Campaigns page) is a major performance bottleneck.
**Action:** Implement a `full=false` mode in the API that returns a server-side `adsCount` and only essential fields, reducing payload size significantly while keeping the UI functional.
