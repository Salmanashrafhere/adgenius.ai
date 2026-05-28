## 2025-05-28 - [Optimization of filtering loops]
**Learning:** Normalizing search queries (e.g., `toLowerCase()`) outside of a `.filter()` or `.map()` callback prevents redundant O(n) string operations. While seemingly minor for small lists, this is a foundational habit for maintaining performance as data sets scale.
**Action:** Always pre-process search terms before entering iteration blocks in React components.
