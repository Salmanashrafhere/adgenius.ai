## 2025-05-21 - Redundant String Normalization in Filter Loops
**Learning:** Performing string operations like `.toLowerCase()` on the search query inside a `.filter()` or `.map()` callback is a common performance anti-pattern. While it seems like a micro-optimization, in large lists or frequently re-rendering components, these redundant operations add up.
**Action:** Always normalize search queries or comparison values once outside the loop and memoize the filtered result using `useMemo` to prevent unnecessary re-calculations on unrelated state changes.
