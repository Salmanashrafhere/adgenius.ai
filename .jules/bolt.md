## 2025-05-15 - Optimizing API Payload with Selective Joins
**Learning:** Selecting only the `id` field from a large joined table (like `ad_creatives`) and mapping it to a count property on the server provides a significant performance boost (up to 90% payload reduction) while maintaining enough data for list views.
**Action:** Always prefer selecting specific fields and using `.select('id')` for count-only joins in list-view API routes to minimize data transfer.

## 2025-05-15 - Backward Compatibility in API Transformations
**Learning:** When transforming API responses for performance (e.g., adding an `adsCount` property), removing the original data source (like the `ad_creatives` array) can break existing clients even if they are currently only using it for length.
**Action:** Preserve original fields when possible or ensure they are only slimmed down rather than removed to maintain backward compatibility during incremental optimizations.
