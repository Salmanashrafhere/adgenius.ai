## 2025-05-14 - API Payload Bloat in Campaign List

**Learning:** The `GET /api/campaigns` route previously fetched all fields and full joined `ad_creatives`, even for list views that only needed a count. This caused unnecessary bandwidth usage and slower parse times. The dashboard also suffered from a pre-existing rendering bug where badges were rendered as raw class strings instead of being applied to elements.

**Action:** Optimized API payload by selecting only necessary fields and reducing the `ad_creatives` join to just IDs for counting (which avoids fetching large text fields). Implemented a `limit` parameter for the dashboard to further reduce initial load time. Fixed the dashboard badge rendering by correctly applying class strings returned by helper functions.
