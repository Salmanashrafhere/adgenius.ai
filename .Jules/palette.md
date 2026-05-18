## 2025-05-18 - [Badge Utility Pattern]
**Learning:** In this application, badge utility functions (like `statusBadge` and `platformBadge`) are designed to return a string of CSS classes rather than a React component. This requires they be applied via the `className` attribute on a wrapper element (e.g., `<span>`).
**Action:** Always check the return type of UI utility functions. If they return strings, apply them as classes to semantic HTML elements.
