## 2025-06-26 - Semantic Accessibility for Interactive Elements
**Learning:** Refactoring interactive `div` elements (like notification items) to semantic `button` elements significantly improves keyboard navigability but requires attention to HTML validity. Nested block elements like `p` or `div` inside a `button` should be replaced with `span` to maintain standard compliance while preserving styling.
**Action:** Always prefer semantic buttons for clickable list items and ensure nested elements are inline-safe.
