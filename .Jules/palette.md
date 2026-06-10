## 2025-05-14 - Notification Accessibility & Consolidation
**Learning:** Consolidating global UI components like notifications into the Header ensures a single source of truth and prevents UI redundancy (e.g., dual bells). Using semantic <button> elements with ARIA labels and visually hidden unread statuses significantly improves the experience for keyboard and screen reader users.
**Action:** Always check for redundant component instances across pages and use the Header for global state. Use semantic elements and ARIA attributes for interactive list items.
