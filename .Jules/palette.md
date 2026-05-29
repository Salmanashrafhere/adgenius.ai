## 2026-05-29 - [Component Contract Preservation]
**Learning:** Centralizing global state or UI elements (like notifications) into a shared layout component (Header) simplifies child components but risks breaking the layout if the `children` prop is accidentally removed or misplaced.
**Action:** Always verify that core layout props like `children` are preserved and correctly positioned during component refactors.
