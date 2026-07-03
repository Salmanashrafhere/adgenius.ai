## 2026-07-03 - Inefficient row counting in Supabase
**Learning:** Fetching all IDs (e.g., `.select('id')`) to determine row count causes unnecessary network overhead and memory usage, especially for large datasets.
**Action:** Use `.select('*', { count: 'exact', head: true })` for efficient row counting without fetching data.

## 2026-07-03 - Next.js Build Artifact Corruption
**Learning:** Changes to shared components or API routes can sometimes lead to inconsistent build artifacts in the `.next` directory, causing 'Cannot find module' errors during development.
**Action:** Delete the `.next` directory and restart the development server if strange module errors occur after code changes.
