## 2025-05-14 - Payload Optimization vs Backward Compatibility
**Learning:** When slimming down API payloads by removing nested relation arrays (e.g., fetching only counts), removing the original key entirely can break frontend consumers that expect the array structure (e.g., `campaign.ad_creatives.length`).
**Action:** Instead of removing the key, fetch only the minimal required field (like `id`) to maintain the array structure while still reducing the overall payload size, and provide a derived field (like `adsCount`) for cleaner frontend usage.
