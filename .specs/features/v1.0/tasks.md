# Daily AI Digest — v1.0 Tasks

**Status**: In Progress  
**Stack**: Node.js + TypeScript · Gemini API · SendGrid · Supabase · GitHub Actions

---

## Progress

- [x] T01 — Init TypeScript project
- [x] T02 — Create folder structure
- [x] T03 — Create config files
- [x] T04 — Define Article type
- [x] T05 — DevTo adapter
- [x] T06 — HackerNews adapter
- [x] T07 — ArXiv adapter
- [x] T08 — Aggregator
- [x] T09 — Deduplicator
- [x] T10 — Ranker
- [x] T11 — Gemini summarizer
- [x] T12 — Email HTML template
- [x] T13 — Email formatter
- [x] T14 — SendGrid sender
- [x] T15 — Supabase schema
- [x] T16 — Supabase service
- [x] T17 — Main orchestrator
- [x] T18 — GitHub Actions workflow

---

## Tasks

### T01 — Init TypeScript project
**What**: `package.json` + `tsconfig.json` + dev dependencies  
**Where**: root  
**Depends on**: —  
**Done when**:
- [ ] `npm install` works
- [ ] `tsc --noEmit` passes with no errors
- [ ] Dependencies: `typescript`, `ts-node`, `axios`, `@google/generative-ai`, `@sendgrid/mail`, `@supabase/supabase-js`, `dotenv`
- [ ] Dev dependencies: `@types/node`, `jest`, `ts-jest`, `@types/jest`

---

### T02 — Create folder structure
**What**: Create all empty directories and index stubs  
**Where**: root  
**Depends on**: T01  
**Done when**:
- [ ] Folders exist: `src/adapters/`, `src/services/`, `src/utils/`, `config/`, `.github/workflows/`
- [ ] `src/index.ts` exists (entry point stub)

---

### T03 — Create config files
**What**: `sources.json`, `llm.json`, `ai-style.json` with values from PRD  
**Where**: `config/`  
**Depends on**: T02  
**Done when**:
- [ ] `config/sources.json` — devto, hackernews, arxiv enabled
- [ ] `config/llm.json` — gemini active, openai/claude disabled
- [ ] `config/ai-style.json` — tone descontraído, português, max 5 linhas
- [ ] `.env.example` with: `GEMINI_API_KEY`, `SENDGRID_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `EMAIL_TO`

---

### T04 — Define Article type
**What**: `Article` interface + shared types  
**Where**: `src/types.ts`  
**Depends on**: T02  
**Done when**:
- [ ] `Article` has: `id`, `title`, `url`, `source`, `publishedAt`, `views`, `comments`, `summary?`, `score?`
- [ ] `Digest` type defined: `date`, `articles: Article[]`, `sentAt`
- [ ] Exported correctly, no TS errors

---

### T05 — DevTo adapter
**What**: Fetch AI articles from Dev.to API  
**Where**: `src/adapters/devto.ts`  
**Depends on**: T04  
**Done when**:
- [ ] `fetchArticles(): Promise<Article[]>` exported
- [ ] Calls `https://dev.to/api/articles?tag=ai&per_page=8`
- [ ] Maps response to `Article` type (source = "DevTo")
- [ ] Handles HTTP errors gracefully (try/catch, returns `[]` on failure)

---

### T06 — HackerNews adapter
**What**: Fetch top stories about AI from HackerNews  
**Where**: `src/adapters/hackernews.ts`  
**Depends on**: T04  
**Done when**:
- [ ] `fetchArticles(): Promise<Article[]>` exported
- [ ] Fetches top 30 story IDs → fetches details for each
- [ ] Filters by AI keywords in title (`AI`, `LLM`, `GPT`, `ML`, `neural`)
- [ ] Maps to `Article` (source = "HackerNews", views = score, comments = descendants)
- [ ] Handles errors gracefully

---

### T07 — ArXiv adapter
**What**: Fetch recent AI/ML papers from ArXiv API  
**Where**: `src/adapters/arxiv.ts`  
**Depends on**: T04  
**Done when**:
- [ ] `fetchArticles(): Promise<Article[]>` exported
- [ ] Calls ArXiv API with `cat:cs.AI+OR+cs.LG`, sorted by `submittedDate`, max 10
- [ ] Parses XML response (use `xml2js` or regex)
- [ ] Maps to `Article` (source = "ArXiv")
- [ ] Handles errors gracefully

---

### T08 — Aggregator
**What**: Run all adapters and merge results  
**Where**: `src/services/aggregator.ts`  
**Depends on**: T05, T06, T07  
**Done when**:
- [ ] `aggregate(): Promise<Article[]>` exported
- [ ] Runs all enabled adapters in parallel (`Promise.all`)
- [ ] Returns flat array of all articles
- [ ] Reads enabled list from `config/sources.json`

---

### T09 — Deduplicator
**What**: Remove duplicate articles by URL  
**Where**: `src/services/deduplicator.ts`  
**Depends on**: T04  
**Done when**:
- [ ] `deduplicate(articles: Article[]): Article[]` exported
- [ ] Removes exact URL duplicates within the same batch
- [ ] `deduplicateWithHistory(articles: Article[], seen: string[]): Article[]` also exported
- [ ] `seen` is a list of URLs already sent (from Supabase, passed in)

---

### T10 — Ranker
**What**: Score and sort articles, return top 10  
**Where**: `src/services/ranker.ts`  
**Depends on**: T04  
**Done when**:
- [ ] `rank(articles: Article[]): Article[]` exported
- [ ] Score = `(recency × 0.3) + (trending × 0.4) + (relevance × 0.3)`
- [ ] Recency: 1.0 if <12h, linear decay to 0 at 24h
- [ ] Trending: `(views + comments)` normalized 0–1 across batch
- [ ] Relevance: keyword match — `LLM/GPT/neural` = +0.2, `AI/ML` = +0.1 (max 1.0)
- [ ] Returns top 10 sorted by score desc
- [ ] Score stored in `article.score`

---

### T11 — Gemini summarizer
**What**: Summarize each article using Gemini Pro  
**Where**: `src/services/summarizer.ts`  
**Depends on**: T04, T03  
**Done when**:
- [ ] `summarize(article: Article): Promise<string>` exported
- [ ] `summarizeAll(articles: Article[]): Promise<Article[]>` exported (sequential to respect rate limits)
- [ ] Prompt reads tone/language from `config/ai-style.json`
- [ ] Summary is max 5 lines, in Portuguese, no preamble
- [ ] If Gemini fails → article.summary = first 300 chars of title + description (fallback)
- [ ] Uses `GEMINI_API_KEY` from env

---

### T12 — Email HTML template
**What**: HTML string builder for the digest email  
**Where**: `src/templates/email.ts`  
**Depends on**: T04  
**Done when**:
- [ ] `buildEmailHtml(articles: Article[], date: string): string` exported
- [ ] Template includes: header, date, 10 article cards (title, source badge, summary, "Ler artigo" link)
- [ ] Professional and casual visual style
- [ ] Plain-text fallback also generated: `buildEmailText(articles: Article[]): string`

---

### T13 — Email formatter
**What**: Compose final email payload (subject + html + text)  
**Where**: `src/services/formatter.ts`  
**Depends on**: T12  
**Done when**:
- [ ] `format(articles: Article[]): EmailPayload` exported
- [ ] `EmailPayload` = `{ subject, html, text }`
- [ ] Subject: `"🤖 Daily AI Digest — {dd/mm/yyyy}"`

---

### T14 — SendGrid sender
**What**: Send the digest email via SendGrid  
**Where**: `src/services/sender.ts`  
**Depends on**: T13  
**Done when**:
- [ ] `send(payload: EmailPayload): Promise<void>` exported
- [ ] Uses `SENDGRID_API_KEY` and `EMAIL_TO` from env
- [ ] Sender email: `digest@dailyaidigest.com` (or configurable via env `EMAIL_FROM`)
- [ ] Retries up to 3× on failure (with 2s delay between)
- [ ] Logs delivery success/failure

---

### T15 — Supabase schema
**What**: SQL migration to create tables  
**Where**: `supabase/migrations/001_initial.sql`  
**Depends on**: —  
**Done when**:
- [ ] Table `articles`: `id`, `url` (unique), `title`, `source`, `summary`, `score`, `published_at`, `created_at`
- [ ] Table `digests`: `id`, `date` (unique), `sent_at`, `article_count`
- [ ] Table `digest_articles`: `digest_id`, `article_id`, `position` (join table)
- [ ] Migration can be run on Supabase SQL editor
- [ ] RLS enabled on all tables (public read, no public write)

---

### T16 — Supabase service
**What**: DB read/write operations  
**Where**: `src/services/supabase.ts`  
**Depends on**: T04, T15  
**Done when**:
- [ ] `getSentUrls(days?: number): Promise<string[]>` — returns URLs sent in last N days (default 30)
- [ ] `saveDigest(articles: Article[]): Promise<void>` — saves digest + articles
- [ ] Uses `SUPABASE_URL` and `SUPABASE_KEY` from env
- [ ] Handles upsert (idempotent — safe to run twice same day)

---

### T17 — Main orchestrator
**What**: Wire all services into the daily digest pipeline  
**Where**: `src/index.ts`  
**Depends on**: T08, T09, T10, T11, T13, T14, T16  
**Done when**:
- [ ] Pipeline: aggregate → deduplicate (with history from Supabase) → rank → summarize → format → send → save
- [ ] Each step logs start/end
- [ ] If <10 articles found after dedup, proceeds with what's available (logs warning)
- [ ] On complete failure: logs error, exits with code 1
- [ ] `npm run digest` triggers the pipeline

---

### T18 — GitHub Actions workflow
**What**: Daily cron to run the digest at 07:00 AM UTC  
**Where**: `.github/workflows/daily-digest.yml`  
**Depends on**: T17  
**Done when**:
- [ ] Cron: `0 7 * * *`
- [ ] Uses `GEMINI_API_KEY`, `SENDGRID_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `EMAIL_TO` from GitHub Secrets
- [ ] Steps: checkout → setup Node 18 → npm install → npm run digest
- [ ] `workflow_dispatch` also enabled (manual trigger)
- [ ] On failure: action fails visibly (non-zero exit)
