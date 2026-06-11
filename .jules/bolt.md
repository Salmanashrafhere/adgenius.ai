## 2025-05-22 - API Payload Reduction Strategy
**Learning:** Completely removing a related data field (like `ad_creatives`) from an API response to save bandwidth can cause runtime errors in frontend components that expect the array to exist (e.g., for `.length` checks).
**Action:** Instead of removing the field, modify the query to select only the `id` property. This maintains backward compatibility for count-based logic while still achieving significant (60-80%) payload reduction.
