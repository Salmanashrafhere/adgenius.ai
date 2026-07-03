## 2025-05-15 - Badge Rendering Pattern
**Learning:** The `platformBadge` and `statusBadge` helper functions in this codebase return Tailwind class strings rather than JSX components. They must be applied to the `className` attribute of a `<span>` or similar element; rendering them as direct children (e.g. within a `<td>`) results in raw CSS class names appearing in the UI.
**Action:** Always wrap badge helper calls in a tag and pass the result to `className`.
