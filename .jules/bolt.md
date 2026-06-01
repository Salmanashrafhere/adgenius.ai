# Bolt's Performance Journal

## 2026-06-01 - Memoizing Dashboard Computations
**Learning:** In the Dashboard component, multiple derived values like unread notification counts and campaign statistics were being recalculated on every render. While these operations are relatively small, they contribute to frame budget consumption, especially when the component re-renders due to state updates (e.g., toast notifications or menu toggles).
**Action:** Use `useMemo` for derived statistics and notification counts to ensure they only update when their source data (`campaigns`, `user`, `notifications`) actually changes. This stabilizes the component's render cycle and prevents redundant processing.
