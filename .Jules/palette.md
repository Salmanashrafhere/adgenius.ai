## 2025-06-08 - Surgical UX and Badge Rendering
**Learning:** Attempting to combine multiple UX improvements (accessibility, shortcuts, and refactoring) across different components without full state context often leads to regressions and rejected PRs. Additionally, badge helper functions that return CSS classes must be applied to `className` rather than rendered as text.
**Action:** Prioritize single, high-impact surgical changes. Always verify that badge strings are used as classes on elements (e.g., `<span className={statusBadge(s)}>{s}</span>`) to ensure intended visual rendering.
