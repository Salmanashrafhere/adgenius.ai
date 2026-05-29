## 2025-05-22 - [Optimizing Filter with Pre-normalized Search Query]
**Learning:** Performing string normalization (e.g., `.toLowerCase()`) inside a `.filter()` callback leads to $O(N)$ redundant operations on every render. Normalizing the query once outside the loop and memoizing the result with `useMemo` significantly improves UI responsiveness during user input.
**Action:** Always lift string normalization out of loops/iterators and use `useMemo` for derived lists that depend on search inputs.
