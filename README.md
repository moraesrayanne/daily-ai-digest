# 🤖 Daily AI Digest

> Curadoria automática dos artigos mais relevantes em Inteligência Artificial — entregue no seu e-mail todo dia às 07:00.

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-agendado-2088FF?style=flat-square&logo=github-actions&logoColor=white)

---

## O que é isso?

O **Daily AI Digest** é um pipeline automatizado que:

1. **Agrega** artigos de múltiplas fontes (RSS, APIs públicas, blogs)
2. **Remove duplicatas** — tanto dentro da coleta quanto com o histórico dos últimos 30 dias
3. **Ranqueia** os artigos por relevância, recência e engajamento
4. **Resume e traduz** os títulos para português com IA (Gemma 3 27B)
5. **Envia** um e-mail HTML elegante com os 10 melhores artigos do dia

Tudo isso roda automaticamente via GitHub Actions, sem servidor, sem custo de infraestrutura.

---

## Exemplo de e-mail

O digest chega formatado com:

- Badge colorido da fonte (Dev.to, Hacker News, ArXiv etc.)
- Numeração destacada (🥇 1º, 2º, 3º...)
- Título traduzido para português
- Resumo de 2 linhas gerado por IA
- Botão direto para o artigo original

---

## Fontes de dados

| Fonte | O que busca |
|---|---|
| **Hacker News** | Top 100 stories filtradas por keywords de AI/ML |
| **Dev.to** | 30 artigos mais recentes com tag `#ai` |
| **ArXiv** | Papers mais recentes de `cs.AI`, `cs.LG` e `cs.CL` |
| **RSS** | Blogs e portais curados (ver abaixo) |
| **Anthropic** | Feed oficial de novidades da Anthropic |

### Feeds RSS incluídos

- OpenAI Blog
- Google DeepMind Blog
- The Verge AI
- TechCrunch AI
- VentureBeat AI
- MIT Technology Review
- Ars Technica

> Feeds são configuráveis em `config/sources.json`.

---

## Como funciona o pipeline

```
┌─────────────┐
│  aggregate  │  Busca artigos de todas as fontes em paralelo
└──────┬──────┘
       ↓
┌─────────────┐
│  deduplicate│  Remove duplicatas por URL (sessão + histórico 30 dias)
└──────┬──────┘
       ↓
┌─────────────┐
│    rank     │  Pontua cada artigo por recência, engajamento e relevância
└──────┬──────┘
       ↓
┌─────────────┐
│  summarize  │  Gemma 3 27B gera título em PT-BR + resumo de 2 linhas
└──────┬──────┘
       ↓
┌─────────────┐
│   format    │  Monta o HTML do e-mail
└──────┬──────┘
       ↓
┌─────────────┐
│    send     │  Entrega via SendGrid
└──────┬──────┘
       ↓
┌─────────────┐
│    save     │  Salva artigos no Supabase (histórico de dedup)
└─────────────┘
```

### Sistema de pontuação (ranker)

Cada artigo recebe uma nota de 0 a 1 com base em três fatores:

| Fator | Peso | Critério |
|---|---|---|
| **Engajamento** | 40% | Views + comentários normalizados pelo artigo mais popular |
| **Recência** | 30% | Nota máxima nas últimas 12h, decai linearmente até 0 em 24h |
| **Relevância** | 30% | Análise do título por tiers de keywords + bônus para fontes premium |

**Tiers de relevância:**
- **Tier 1** (+0.35): Modelos conhecidos (GPT, Claude, Gemini, LLaMA...), SOTA, breakthrough, alignment
- **Tier 2** (+0.20): Empresas líderes (OpenAI, Anthropic, DeepMind...), LLM, transformer, fine-tuning
- **Tier 3** (+0.10): Termos gerais de AI/ML
- **Penalidade** (−0.20): Tutoriais, listicles, conteúdo introdutório
- **Fontes premium** (+0.50): Anthropic, OpenAI, Google DeepMind, The Verge AI, TechCrunch AI

---

## Instalação e uso local

### Pré-requisitos

- Node.js 20+
- Conta no [SendGrid](https://sendgrid.com) (envio de e-mail)
- Conta no [Supabase](https://supabase.com) (histórico)
- Chave de API do [Google AI Studio](https://aistudio.google.com) (sumarização)

### 1. Clone e instale as dependências

```bash
git clone https://github.com/moraesrayanne/daily-ai-digest.git
cd daily-ai-digest
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
GEMINI_API_KEY=sua_chave_aqui
SENDGRID_API_KEY=sua_chave_aqui
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=sua_service_role_key
EMAIL_TO=destinatario@email.com
EMAIL_FROM=remetente@seudominio.com
```

### 3. Configure o banco de dados (Supabase)

Execute no SQL Editor do Supabase:

```sql
create table articles (
  id uuid primary key default gen_random_uuid(),
  url text unique not null,
  title text,
  source text,
  summary text,
  score float,
  published_at timestamptz,
  created_at timestamptz default now()
);

create table digests (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  article_count int,
  created_at timestamptz default now()
);

create table digest_articles (
  digest_id uuid references digests(id),
  article_id uuid references articles(id),
  position int,
  primary key (digest_id, article_id)
);
```

### 4. Rode o digest

```bash
npm run digest
```

---

## Agendamento automático (GitHub Actions)

O workflow `.github/workflows/daily-digest.yml` executa o pipeline todo dia às **07:00 UTC** (04:00 no horário de Brasília).

Para configurar no seu repositório, adicione os seguintes **Secrets** em _Settings → Secrets and variables → Actions_:

| Secret | Descrição |
|---|---|
| `GEMINI_API_KEY` | Chave da API do Google AI Studio |
| `SENDGRID_API_KEY` | Chave da API do SendGrid |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_KEY` | Service role key do Supabase |
| `EMAIL_TO` | E-mail do destinatário |
| `EMAIL_FROM` | E-mail remetente verificado no SendGrid |

Para disparar manualmente: **Actions → Daily AI Digest → Run workflow**.

---

## Estrutura do projeto

```
daily-ai-digest/
├── config/
│   ├── sources.json        # Fontes habilitadas e feeds RSS
│   └── ai-style.json       # Tom e idioma dos resumos gerados
├── src/
│   ├── index.ts            # Orquestrador do pipeline
│   ├── types.ts            # Tipos TypeScript
│   ├── adapters/           # Conectores por fonte
│   │   ├── devto.ts
│   │   ├── hackernews.ts
│   │   ├── arxiv.ts
│   │   ├── rss.ts
│   │   └── anthropic.ts
│   ├── services/           # Lógica de negócio
│   │   ├── aggregator.ts   # Orquestra os adapters
│   │   ├── deduplicator.ts # Filtra artigos repetidos
│   │   ├── ranker.ts       # Pontua e seleciona os top 10
│   │   ├── summarizer.ts   # Sumarização via Gemma 3 27B
│   │   ├── formatter.ts    # Monta o payload do e-mail
│   │   ├── sender.ts       # Envio via SendGrid
│   │   └── supabase.ts     # Persistência e histórico
│   └── templates/
│       └── email.ts        # Template HTML do e-mail
└── .github/
    └── workflows/
        └── daily-digest.yml
```

---

## Personalização

### Adicionar ou remover fontes RSS

Edite `config/sources.json`:

```json
{
  "rssFeeds": [
    { "name": "Minha Fonte", "url": "https://exemplo.com/feed.rss" }
  ]
}
```

### Alterar o tom dos resumos

Edite `config/ai-style.json`:

```json
{
  "tone": "descontraído",
  "language": "português"
}
```

### Pular a sumarização (modo rápido)

```bash
SKIP_SUMMARIZE=true npm run digest
```

---

## Testes

```bash
npm test
```

---

## Tecnologias

- **TypeScript** — tipagem estática em todo o pipeline
- **Google AI (Gemma 3 27B)** — sumarização e tradução dos títulos
- **SendGrid** — entrega de e-mail transacional
- **Supabase** — histórico de artigos enviados (deduplicação)
- **GitHub Actions** — agendamento e execução sem servidor
- **xml2js** — parsing de feeds RSS/Atom
- **axios** — requisições HTTP

---

## Licença

MIT © [Ray Moraes](https://github.com/moraesrayanne)
