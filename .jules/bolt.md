## 2025-05-14 - Payload optimization via partial selection
**Learning:** In Supabase/PostgREST, selecting all fields from a joined table (`table(*)`) can significantly increase response size. Narrowing selection to only required fields (e.g., `table(id)`) and providing a derived count property (`adsCount`) can reduce payload size by 60-80% for list views.
**Action:** Always prefer narrow selection in list APIs. Provide a `full` parameter for cases where complete object graphs are required.
