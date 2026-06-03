## 2026-06-03 - Memoization of Dashboard Derived State
**Learning:** Derived state like unread counts (filtering) and dashboard statistics (reduction) were being recalculated on every render in `app/dashboard/page.js`, even during UI-only updates like toggling notification dropdowns. Using `useMemo` prevents these O(N) operations and reference changes.
**Action:** Always check for un-memoized loops, filters, and reduces in core dashboard components that handle growing data sets (like campaigns or notifications).
