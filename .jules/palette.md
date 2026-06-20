## 2025-05-15 - Badge Rendering Pattern
**Learning:** The `platformBadge` and `statusBadge` helper functions in this codebase return Tailwind class strings rather than JSX components. When used incorrectly as React children (as seen in the original `app/dashboard/page.js`), they render raw CSS class names in the UI.
**Action:** Always wrap badge helper results in a `<span>` and apply the helper's return value to the `className` attribute.

## 2025-05-15 - Accessibility for Action Tables
**Learning:** Icon-only buttons in data tables (like View, Download, Delete) are often missing `aria-label` attributes and visible focus states, making them inaccessible to screen readers and keyboard users.
**Action:** Ensure all icon-only buttons have descriptive, contextual `aria-label` attributes and use `focus-visible` rings for keyboard navigation.
