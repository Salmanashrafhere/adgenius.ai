## 2025-05-14 - Header interaction and accessibility enhancements
**Learning:** When implementing unread status indicators in notification lists, purely visual cues like colored dots are inaccessible to screen reader users; including an `.sr-only` span with "Unread" text provides necessary context.
**Action:** Always pair visual indicators with screen-reader-only descriptive text.
