# Spec: Frontend Modular Refactor

## Goal
Separate styling from logic and apply modular architecture across the Next.js frontend.

## Requirements

### REF-01 — Style separation per component
Every client component that contains `styled` declarations must have its styles extracted into a co-located `ComponentName.styles.ts` file. The `.tsx` file imports from `.styles.ts`.

**Scope:**
- `components/Header.tsx` → `components/Header.styles.ts`
- `components/DigestCard.tsx` → `components/DigestCard.styles.ts`
- `components/ArticleRow.tsx` → `components/ArticleRow.styles.ts`
- `components/SourcePill.tsx` → `components/SourcePill.styles.ts`
- `components/Toggle.tsx` → `components/Toggle.styles.ts`
- `app/HomeClient.tsx` → `app/HomeClient.styles.ts`
- `app/digest/[date]/DigestClient.tsx` → `app/digest/[date]/DigestClient.styles.ts`
- `app/digest/[date]/ArticleListClient.tsx` → `app/digest/[date]/ArticleListClient.styles.ts`

### REF-02 — Shared style tokens
Hardcoded source colors and repeated style values extracted to `styles/tokens.ts`:
- Source colors from `SourcePill.tsx` (background/text per source)
- Any other hardcoded hex values shared across components

### REF-03 — Shared utility consolidation
- `MONTHS_SHORT` array (duplicated in 4+ files) → single export in `lib/formatDate.ts`
- `formatArticleDate()` (duplicated in `ArticleList.tsx` + API route) → moved to `lib/formatDate.ts`
- All consumers updated to import from `lib/formatDate.ts`

### REF-04 — Remove dead code
- `lib/registry.tsx` is a no-op (returns `<>{children}</>`). Remove file and remove import from `app/layout.tsx`.

### REF-05 — Supabase client consolidation
- `app/DigestFeed.tsx` and `app/digest/[date]/ArticleList.tsx` call `createClient(...)` inline.
- Both must use `lib/supabase.ts` `getSupabase()` instead.

## Out of Scope
- Dark mode implementation
- Test coverage
- API refactoring
- Accessibility improvements
- Performance optimizations

## Done When
- `npx tsc --noEmit` returns 0 errors
- `npm run build` succeeds
- All pages render correctly in dev server
- No styled-components remain inline in `.tsx` files (only in `.styles.ts`)
- No duplicated `MONTHS_SHORT` arrays outside `lib/formatDate.ts`
