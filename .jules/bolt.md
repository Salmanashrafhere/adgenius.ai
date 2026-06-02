## 2025-05-14 - Optimized Campaign Filtering

**Learning:** Campaign filtering was performing O(N*M) string operations (toLowerCase) on every render because the search query was normalized inside the filter loop. Memoizing the result and normalizing the query once outside the loop significantly reduces CPU overhead, especially as the number of campaigns grows.

**Action:** Always check if string normalization (like `toLowerCase()`) can be moved outside of `.filter()` or `.map()` loops when used with `useMemo`.
