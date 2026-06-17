## 2025-05-14 - API Payload Optimization for Campaigns List
**Learning:** Selecting all fields (*) in joins (like ad_creatives) for list views causes significant payload bloat as the number of related items grows, even if only the count is needed.
**Action:** Use field selection in joins (e.g., ad_creatives(id)) and map to a count property (adsCount) on the server to maintain frontend compatibility while drastically reducing JSON size.
