# Tasks: Frontend Modular Refactor

## T01 — Shared utilities + tokens + dead code [sequential first]
**What:** 
1. Add `MONTHS_SHORT` export + move `formatArticleDate` into `lib/formatDate.ts`
2. Create `styles/tokens.ts` with source color map
3. Delete `lib/registry.tsx`; remove its import from `app/layout.tsx`
4. Update `app/DigestFeed.tsx` and `app/digest/[date]/ArticleList.tsx` to use `getSupabase()` from `lib/supabase.ts`
**Gate:** `npx tsc --noEmit` passes

---

## T02 [P] — Extract Header.styles.ts
**What:** Move all `styled` declarations from `components/Header.tsx` into `components/Header.styles.ts`. Import them back.
**Gate:** Component renders, no TS errors

## T03 [P] — Extract DigestCard.styles.ts
**What:** Move all `styled` declarations from `components/DigestCard.tsx` into `components/DigestCard.styles.ts`. Import them back.
**Gate:** Component renders, no TS errors

## T04 [P] — Extract ArticleRow.styles.ts
**What:** Move all `styled` declarations from `components/ArticleRow.tsx` into `components/ArticleRow.styles.ts`. Import them back.
**Gate:** Component renders, no TS errors

## T05 [P] — Extract SourcePill.styles.ts
**What:** Move all `styled` declarations from `components/SourcePill.tsx` into `components/SourcePill.styles.ts`. Import source color tokens from `styles/tokens.ts`. Import styles back into component.
**Gate:** Component renders, no TS errors

## T06 [P] — Extract Toggle.styles.ts
**What:** Move all `styled` declarations from `components/Toggle.tsx` into `components/Toggle.styles.ts`. Import them back.
**Gate:** Component renders, no TS errors

## T07 [P] — Extract HomeClient.styles.ts
**What:** Move all `styled` declarations from `app/HomeClient.tsx` into `app/HomeClient.styles.ts`. Import them back.
**Gate:** Component renders, no TS errors

## T08 [P] — Extract DigestClient.styles.ts
**What:** Move all `styled` declarations from `app/digest/[date]/DigestClient.tsx` into `app/digest/[date]/DigestClient.styles.ts`. Import them back.
**Gate:** Component renders, no TS errors

## T09 [P] — Extract ArticleListClient.styles.ts
**What:** Move all `styled` declarations from `app/digest/[date]/ArticleListClient.tsx` into `app/digest/[date]/ArticleListClient.styles.ts`. Import them back.
**Gate:** Component renders, no TS errors

---

## T10 — Final gate [after all above]
**What:** Run `npx tsc --noEmit` and `npm run build`. Fix any remaining errors.
**Gate:** Build succeeds with 0 TS errors
