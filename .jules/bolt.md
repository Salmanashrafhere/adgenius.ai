# Bolt's Performance Journal

## 2025-05-14 - API Payload Bloat in List Views
**Learning:** Fetching full relational data (e.g., `ad_creatives(*)`) for every item in a list view causes exponential payload growth as the user creates more data. This leads to slow network transfers and increased memory usage on the client.
**Action:** Use a `full=false` pattern for list endpoints. Select only required fields and provide counts for related collections (e.g., `adsCount`) instead of the full objects.

## 2025-05-14 - Unnecessary Re-calculations in React
**Learning:** Calculating statistics (like total ads count) from a large array of objects inside the component body without memoization leads to performance degradation during re-renders.
**Action:** Use `useMemo` for derived statistics to ensure they are only re-calculated when the underlying data changes.
