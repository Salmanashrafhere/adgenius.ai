## 2024-05-22 - Dashboard Stats Optimization
**Learning:** React 19's `useMemo` and `useCallback` are still essential for preventing expensive re-calculations and unnecessary re-renders in heavy dashboard components. The dashboard's statistics were being re-calculated on every render, even when the underlying data hadn't changed.
**Action:** Always wrap data-derived statistics and filtered lists in `useMemo` when the source data is stable.
