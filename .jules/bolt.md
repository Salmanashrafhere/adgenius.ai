# Bolt's Performance Journal

## 2026-06-21 - Optimizing API Payloads for List Views
**Learning:** Large JSON payloads from `select(*)` queries significantly increase TTFB and download time, especially when joining related tables. However, slimming down payloads can break consumers that expect certain fields.
**Action:** When optimizing list APIs, select only the fields required by the UI and include derived properties (like `adsCount`) to maintain compatibility while reducing data transfer. Use `ad_creatives(id)` to allow `.length` checks without fetching full child objects.
