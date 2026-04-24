# Frontend Implementation Plan — Daily AI Digest

## Objetivo

Construir um site web onde o usuário pode abrir todas as manhãs e ler os artigos do dia, com o mesmo design do arquivo `Daily AI Digest.html`. Os dados vêm do Supabase (já populado pelo pipeline backend existente).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Styling | Styled Components |
| Fetch de dados | TanStack React Query + Axios |
| Banco de dados | Supabase (mesmo usado pelo backend) |
| Testes unitários | Jest |
| Testes e2e | Playwright |

---

## Estrutura de Diretórios

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout com fonts e providers
│   │   ├── page.tsx                # Home — lista de digests
│   │   ├── digest/
│   │   │   └── [date]/
│   │   │       └── page.tsx        # Detalhe de um digest
│   │   └── api/
│   │       └── digests/
│   │           ├── route.ts        # GET /api/digests — lista paginada
│   │           └── [date]/
│   │               └── route.ts    # GET /api/digests/:date — detalhe
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── DigestCard.tsx
│   │   ├── ArticleRow.tsx
│   │   ├── SourcePill.tsx
│   │   └── Toggle.tsx
│   ├── lib/
│   │   ├── supabase.ts             # Client-side Supabase client
│   │   └── theme.ts                # CSS vars e tokens de design
│   ├── hooks/
│   │   ├── useDigests.ts           # React Query hook — lista
│   │   └── useDigest.ts            # React Query hook — detalhe
│   ├── styles/
│   │   ├── globals.css             # Reset, variáveis CSS, keyframes
│   │   └── registry.tsx            # Styled Components SSR registry
│   └── types/
│       └── digest.ts               # Tipos compartilhados front-end
├── public/
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Design System (extraído do HTML)

### Paleta de Cores (variáveis CSS)

```css
--bg: #F9F8F5
--bg-card: #FFFEFB
--bg-hover: #F4F2EE
--text-primary: #1C1917
--text-secondary: #6B6459
--text-muted: #9C9189
--accent: oklch(63% 0.16 40)        /* terracota/laranja */
--accent-light: oklch(93% 0.05 40)
--accent-mid: oklch(80% 0.10 40)
--border: #E8E4DE
--border-strong: #D4CFC8
```

### Dark Mode (via `data-dark="1"` no `<html>`)

```css
--bg: #1A1917
--bg-card: #222120
--bg-hover: #2A2927
--text-primary: #F0EEE8
--text-secondary: #B0A898
--text-muted: #7A736A
--border: #302E2B
--border-strong: #3E3B37
```

### Tipografia

- **Serif:** `Instrument Serif` — usada em títulos, números de posição, data
- **Sans:** `DM Sans` — usada em todo o resto

### Source Pills

| Source | Background | Cor do texto |
|---|---|---|
| arxiv | `#EEF0FF` | `#4A55D0` |
| hn | `#FFF0E8` | `#C04A00` |
| devto | `#E8F5E9` | `#2A7A3A` |
| techcrunch | `#F3E8FF` | `#7C3AAD` |
| mit | `#E8F4FF` | `#0A5FA8` |

---

## Páginas e Componentes

### 1. Home Page (`/`)

**Layout:**
- Header fixo com logo "Daily *AI* Digest" + indicador de atualização 07:00
- Hero: título `"O que importa em IA, curado todo dia para você."`
- Feed: lista de `DigestCard` ordenada por data (mais recente primeiro)

**DigestCard:**
- Coluna de data (número grande em serif + mês abreviado)
- Badge "Hoje" se for o digest do dia
- Primeiros 5 títulos de artigos numerados + "N mais artigos"
- Hover: translate X(4px) + cor de acento no número da data + seta
- Click → navega para `/digest/:date`

### 2. Digest Detail Page (`/digest/[date]`)

**Layout:**
- Header com botão "← Feed" + data como subtítulo
- Day header: badge "Hoje", data publicação, título, descrição
- Lista de `ArticleRow`

**ArticleRow:**
- Badge de posição: #1 = accent sólido, #2 = accent-mid, #3 = accent-light, resto = bg-hover
- SourcePill + data original do artigo
- Título em serif (hover → cor de acento)
- Click → expande com resumo + botão "Ler artigo original"
- Apenas um artigo expandido por vez

### 3. Header (compartilhado)

- Sticky, backdrop blur
- Logo com ícone estrela
- Botão "← Feed" apenas na detail page
- Indicador pulsante verde "Atualizado 07:00"

---

## API Routes (Next.js)

### `GET /api/digests`

Retorna lista de digests com os primeiros 10 títulos de artigos (para o feed da home).

```ts
// Query Supabase: tabela digests + digest_articles + articles
// Ordenado por date DESC
// Resposta:
[{
  date: string,          // "2026-04-22"
  publishedAt: string,   // "22 abr 2026, 07:00"
  articleCount: number,
  titles: string[]       // primeiros 10 títulos traduzidos
}]
```

### `GET /api/digests/:date`

Retorna digest completo com todos os artigos e resumos.

```ts
// Resposta:
{
  date: string,
  articles: [{
    pos: number,
    source: string,
    title: string,         // título traduzido
    summary: string,
    originalDate: string,
    url: string
  }]
}
```

---

## Schema Supabase Existente

As tabelas já existem no backend:

- `digests` — `id`, `date`, `article_count`
- `articles` — `id`, `url`, `title`, `source`, `summary`, `score`, `published_at`
- `digest_articles` — `digest_id`, `article_id`, `position`

As API routes fazem joins para montar a resposta.

---

## Funcionalidades

### Must Have (v1)
- [ ] Home com feed de digests
- [ ] Detail page com artigos expansíveis
- [ ] Dark mode (toggle persistido em `localStorage`)
- [ ] Responsivo (mobile-first, max-width 760px)
- [ ] Fontes Google Fonts (Instrument Serif + DM Sans)
- [ ] Grain overlay (efeito de textura do design)
- [ ] Animações: `fadeUp`, `fadeIn`, `slideIn`

### Nice to Have (v2)
- [ ] Troca de cor de acento
- [ ] Feed compacto
- [ ] Paginação no feed (carregar mais)

---

## Histórias de Implementação

### História 1 — Setup do projeto Next.js

**Tarefas:**
- Inicializar `web/` com `create-next-app` (TypeScript, App Router, sem Tailwind)
- Instalar dependências: `styled-components`, `@tanstack/react-query`, `axios`, `@supabase/supabase-js`
- Configurar Styled Components com SSR registry
- Configurar variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Importar Google Fonts no `layout.tsx`
- Criar `globals.css` com todas as variáveis CSS e keyframes do design
- Criar `lib/supabase.ts` com client público

**Critérios de Aceitação:**
- `npm run dev` sobe sem erros
- Fontes carregam corretamente
- Variáveis CSS disponíveis globalmente

---

### História 2 — API Routes

**Tarefas:**
- Criar `app/api/digests/route.ts` com query no Supabase
- Criar `app/api/digests/[date]/route.ts` com query detalhada
- Criar `src/types/digest.ts` com interfaces `DigestListItem` e `DigestDetail`
- Criar `hooks/useDigests.ts` e `hooks/useDigest.ts` com React Query

**Critérios de Aceitação:**
- `GET /api/digests` retorna array com digests do Supabase
- `GET /api/digests/2026-04-22` retorna artigos com posição e resumo
- Hooks gerenciam loading/error states

---

### História 3 — Componentes Base

**Tarefas:**
- `SourcePill.tsx` — pill colorida por source
- `Toggle.tsx` — toggle de dark mode
- `Header.tsx` — header sticky com logo e indicador
- Criar `ThemeProvider` para dark mode com persistência em `localStorage`

**Critérios de Aceitação:**
- Pills renderizam com cores corretas por source
- Header fica fixo no scroll
- Dark mode toggle persiste entre sessões

---

### História 4 — Home Page

**Tarefas:**
- Implementar `DigestCard.tsx` com toda lógica de hover e badges
- Implementar `HomeView` com hero e feed
- Conectar com `useDigests` hook
- Estados de loading (skeleton) e erro

**Critérios de Aceitação:**
- Feed exibe digests ordenados por data
- Badge "Hoje" aparece no digest do dia atual
- Hover funciona com animações corretas
- Click navega para detail page

---

### História 5 — Detail Page

**Tarefas:**
- Implementar `ArticleRow.tsx` com expand/collapse
- Implementar `DetailView` com day header
- Conectar com `useDigest` hook
- Botão "← Feed" no header

**Critérios de Aceitação:**
- Apenas um artigo expandido por vez
- Badges de posição com cores corretas (#1, #2, #3, resto)
- Link "Ler artigo original" abre em nova aba
- Animações `slideIn` por artigo com delay escalonado

---

### História 6 — Testes e QA

**Tarefas:**
- Testes unitários Jest: `SourcePill`, `Toggle`, `DigestCard`, `ArticleRow`
- Testes e2e Playwright: fluxo home → detail → expand artigo → voltar
- Teste de dark mode toggle
- Cobertura > 80%

**Critérios de Aceitação:**
- Todos os testes passando
- Coverage report > 80%
- Playwright testa o fluxo completo

---

## Decisões de Arquitetura

### Por que App Router (Next.js 14)?
- Server Components para as API routes sem expor credenciais do Supabase
- `generateStaticParams` pode pré-renderizar digests passados
- Melhor SEO com metadata por página

### Por que Styled Components e não CSS Modules?
- O design usa inline styles extensivamente e variáveis CSS — Styled Components facilita a migração fiel
- Alinhado com a stack definida no CLAUDE.md

### Por que as API routes em vez de chamar Supabase direto do client?
- O `SUPABASE_KEY` (service role) não é exposto ao browser
- Permite adicionar cache e transformação de dados no server
- Anon key pública pode ser usada como fallback se necessário

---

## Comandos para Rodar

```bash
# Instalar dependências
cd web && npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Testes unitários
npm test

# Testes e2e
npx playwright test
```

---

## Variáveis de Ambiente Necessárias

```env
# web/.env.local
NEXT_PUBLIC_SUPABASE_URL=<mesmo do backend>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key pública do Supabase>
```
