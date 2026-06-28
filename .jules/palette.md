## 2025-05-15 - [Centralizing Global UI Elements]
**Learning:** Redundant implementations of global UI elements (like notification bells) in individual pages lead to UI glitches, inconsistent state (like badge counts), and layout breakage.
**Action:** Always centralize global UI components in shared layout elements (like `Header.js`) and remove local overrides in page-level components.

## 2025-05-15 - [Layout-Aware Component Composition]
**Learning:** Rendering `{children}` outside of the main layout container can lead to misplaced elements (e.g., a floating bell icon) when pages try to inject content into the header.
**Action:** Ensure `{children}` in layout components are placed within the appropriate flex/grid container to maintain alignment.
