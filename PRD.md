# 📋 PRD - Daily AI Digest

**Versão:** 1.1  
**Data:** Abril 2024  
**Status:** Ready for Development  
**Autor:** Rayanne

---

## 📌 Executive Summary

**Daily AI Digest** é uma automação inteligente que coleta, resume e entrega os 10 artigos mais relevantes sobre IA a cada manhã via email. O sistema utiliza múltiplas fontes de dados, IA generativa (Gemini) para sumarização e é totalmente escalável para evoluir para um website público que reutiliza o mesmo histórico.

**Objetivo Principal:** Economizar tempo do usuário filtrando e resumindo conteúdo de qualidade sobre IA em um único email diário, com opção de visualizar histórico em website público.

---

## 🎯 Objetivos de Negócio

1. **Entregar valor imediato** - Email diário com conteúdo curado em menos de 5 minutos de leitura
2. **Fundação escalável** - Arquitetura preparada para múltiplos usuários (futuramente)
3. **Flexibilidade máxima** - Fácil adicionar/remover/trocar fontes e IA sem refazer código
4. **Custo zero** - Operação completamente gratuita (Gemini API free tier)
5. **Zero manutenção** - Automação 100% no GitHub Actions
6. **Website público** - Qualquer pessoa pode visualizar histórico sem autenticação

---

## 👥 User Personas

### **Persona 1: Tech Professional (Primária)**
- **Nome:** Marcus, 28-35 anos
- **Ocupação:** Engenheiro ML, Data Scientist, Product Manager
- **Problema:** Não tem tempo de ficar atualizado em tendências de IA
- **Solução Esperada:** Resumo curado diariamente no email
- **Valor:** 30 min/semana economizados, mantém expertise atualizada
- **Sensibilidade:** Qualidade > quantidade, quer entender rápido se interessa

### **Persona 2: Startup Founder (Secundária)**
- **Nome:** Sofia, 25-40 anos
- **Ocupação:** CEO/Founder de startup tech
- **Problema:** Precisa ficar atualizada em AI/ML pra negócio, mas tempo escasso
- **Solução Esperada:** Digest com insights práticos para negócio
- **Valor:** Inteligência competitiva, estratégia informada
- **Sensibilidade:** Relevância para mercado, tendências, tecnologias disruptivas

### **Persona 3: AI Enthusiast (Terciária)**
- **Nome:** João, 18-50 anos
- **Ocupação:** Estudante, Hobby, Curiosidade
- **Problema:** Quer aprender sobre IA mas fonte é dispersa
- **Solução Esperada:** Conteúdo educativo consolidado
- **Valor:** Aprendizado, descoberta, comunidade (futuro)
- **Sensibilidade:** Acessibilidade, qualidade explicativa

### **Persona 4: Website Visitor (Terciária)**
- **Nome:** Ana, qualquer idade
- **Ocupação:** Qualquer profissão
- **Problema:** Quer acompanhar novidades em IA de forma casual
- **Solução Esperada:** Website com histórico de artigos
- **Valor:** Conteúdo curado sem se inscrever em email
- **Sensibilidade:** Interface simples, sem necessidade de login

---

## 📊 User Stories

### **v1.0 - MVP (Email + Backend)**

#### **US-001: Receber Email Diário com Top 10 Artigos**
```
COMO: Tech professional
QUERO: Receber email todo dia 07:00 AM com 10 resumos de artigos sobre IA
PARA: Ficar atualizado sem gastar tempo pesquisando

CRITÉRIOS DE ACEITAÇÃO:
- [ ] Email chega DIARIAMENTE às 07:00 AM (±5 min)
- [ ] Contém EXATAMENTE 10 artigos
- [ ] Cada artigo tem: título, fonte, resumo (5 linhas max), link
- [ ] Resumo é legível e informativo
- [ ] Email tem visual profissional/atraente e descontraído
- [ ] Link "Ler artigo" funciona corretamente
- [ ] Nenhum artigo duplicado
- [ ] Artigos de últimas 24h

NOTAS:
- Horário fixo: 07:00 AM (timezone do usuário)
- Fontes: Dev.to, HackerNews, ArXiv (inicialmente)
- Resumos via Gemini Pro (API free tier)
- Email enviado via SendGrid
```

#### **US-002: Artigos Resumidos em 5 Linhas com Contexto**
```
COMO: Tech professional lendo o email
QUERO: Resumo conciso em até 5 linhas que me ajude a decidir se leio completo
PARA: Tomar decisão em < 1 min por artigo

CRITÉRIOS DE ACEITAÇÃO:
- [ ] Cada resumo tem MÁXIMO 5 linhas
- [ ] Resumo é escrito em português
- [ ] Inclui conceitos principais
- [ ] Inclui números/resultados (se relevante)
- [ ] Linguagem técnica mas acessível e descontraída
- [ ] Fonte está clara ([DevTo], [HackerNews], etc)
- [ ] Quality >= 8/10 (verificar aleatoriamente)

NOTAS:
- Usar Gemini Pro (gratuito)
- Prompt otimizado para IA
- Testar com diferentes modelos de LLM (OpenAI, Claude futuros)
- Sistema de customização de tom via prompt engineering
```

#### **US-003: Artigos Ordenados por Relevância**
```
COMO: Tech professional recebendo o email
QUERO: Ver PRIMEIRO os artigos mais relevantes/importantes
PARA: Ler o melhor conteúdo se tiver pouco tempo

CRITÉRIOS DE ACEITAÇÃO:
- [ ] Top 3 artigos são os mais importantes
- [ ] Ordenação leva em conta: recência, trending, relevância à IA
- [ ] Score é calculado de forma consistente
- [ ] Sem bias para uma fonte específica

NOTAS:
- Algoritmo: (recência×0.3) + (trending×0.4) + (relevância×0.3)
- Trending = views + comments no article
- Relevância = keywords matching ("IA", "LLM", "ML", etc)
```

#### **US-004: Sem Artigos Duplicados**
```
COMO: Tech professional
QUERO: Não receber o mesmo artigo 2x em dias diferentes
PARA: Ter sempre conteúdo novo

CRITÉRIOS DE ACEITAÇÃO:
- [ ] Sistema detecta URLs duplicadas
- [ ] Não envia artigo já enviado nos últimos 30 dias
- [ ] De-duplicação funciona cross-sources
- [ ] Sem false positives (artigos similares não são duplicados)

NOTAS:
- Cache no Supabase
- Validação por URL exata
- Considerar shortened URLs
```

#### **US-005: Histórico de Artigos no Banco de Dados**
```
COMO: Developer/System admin
QUERO: Histórico de todos os digests enviados em banco de dados
PARA: Ter backup, Analytics futuros, v1.5+ website

CRITÉRIOS DE ACEITAÇÃO:
- [ ] Cada digest é salvo no Supabase
- [ ] Inclui: data, 10 artigos, metadados, timestamp envio
- [ ] Dados estruturados para query posterior
- [ ] Sem perda de dados
- [ ] Performance aceitável (< 100ms por insert)

NOTAS:
- Supabase PostgreSQL (free tier)
- Schema: articles, digests, digest_stats
- Índices para performance
- Dados reutilizados para website público v1.5+
```

---

### **v1.5 - Website Público (Roadmap)**

#### **US-201: Visualizar Digest no Website**
```
COMO: Qualquer pessoa (sem login)
QUERO: Acessar website e ver os últimos digests
PARA: Ler conteúdo sem ser assinante do email

CRITÉRIOS DE ACEITAÇÃO:
- [ ] Website mostra últimos 30 dias
- [ ] Cada dia tem link: /archive/2024-01-22
- [ ] Responsive design (mobile + desktop)
- [ ] Performance: load < 2s
- [ ] SEO básico implementado
- [ ] Sem necessidade de autenticação

NOTAS:
- Frontend: React + Vite
- Deploy: Vercel
- Público (sem autenticação)
- Dados vêm direto do Supabase (mesmo do email)
```

#### **US-202: Sistema de Favoritos com localStorage**
```
COMO: Website visitor
QUERO: Salvar artigos como favoritos localmente
PARA: Ter biblioteca pessoal sem criar conta

CRITÉRIOS DE ACEITAÇÃO:
- [ ] Botão "Favoritar" em cada artigo
- [ ] Favoritos salvos em localStorage do navegador
- [ ] Página /favorites mostra meus favoritos
- [ ] Persiste ao fechar/abrir navegador
- [ ] Funciona offline
- [ ] Ícone visual indicando favorito

NOTAS:
- v1.5: localStorage apenas (sem backend)
- v2.0+: Sincronizar com backend se usuário criar conta
```

#### **US-203: Busca e Filtros no Website**
```
COMO: Website visitor
QUERO: Buscar artigos por palavra-chave e filtrar por fonte
PARA: Encontrar conteúdo específico rápido

CRITÉRIOS DE ACEITAÇÃO:
- [ ] Campo de busca funciona em tempo real
- [ ] Filtro por fonte (DevTo, HackerNews, ArXiv)
- [ ] Filtro por data range
- [ ] Resultados atualizados instantly
- [ ] Sem necessidade de refresh

NOTAS:
- Search feito no frontend (dados do Supabase)
- Ou usar Supabase full-text search
```

---

## 🎨 Requisitos Funcionais

### **RF-001: Aggregação de Múltiplas Fontes**

**Descrição:** Sistema busca artigos de 3+ fontes diferentes

| Fonte | API/Feed | Limit | Relevância | Status |
|-------|----------|-------|-----------|--------|
| Dev.to | REST | 8 artigos | Alta (comunidade tech) | ✅ v1.0 |
| HackerNews | REST | 30 stories | Muito Alta (trending) | ✅ v1.0 |
| ArXiv | REST | 10 papers | Muito Alta (research) | ✅ v1.0 |
| Medium | RSS | TBD | Média | ⏳ v1.5 |
| Reddit | REST | TBD | Baixa-Média | ⏳ v2.0 |

**Configuração:** `config/sources.json` (editar sem código)

**Todas as APIs são gratuitas e unlimited**

---

### **RF-002: Sumarização com IA**

**Descrição:** Cada artigo é resumido por IA generativa

| Provedor | Modelo | Custo | Status | 
|----------|--------|-------|--------|
| Google | Gemini Pro | Grátis | ✅ Ativo |
| OpenAI | GPT-4 Turbo | ~R$ 0.10/resumo | ⏸️ Disabled |
| Anthropic | Claude 3.5 | ~R$ 0.15/resumo | ⏸️ Disabled |
| Ollama | Mistral 7B | Grátis (local) | ⏸️ Disabled |

**Configuração:** `config/llm.json` (mudar sem código)

**Constraints:**
- Máximo 5 linhas
- Português
- Sem preamble
- Resposta estruturada
- Tone customizável via prompt engineering

**Custo Operacional:**
- Gemini Pro: 60 requests/min gratuitos
- ~30-35 artigos/dia × 1 chamada = ~35 requests/dia
- **Total mensal: R$ 0,00** ✅

---

### **RF-003: Ranking Inteligente**

**Descrição:** Top 10 artigos selecionados por algoritmo

```
SCORE = (recência × 0.3) + (trending × 0.4) + (relevância × 0.3)

Onde:
- recência: 1.0 se < 12h, decay linear até 24h
- trending: views + comments normalizados (0-1)
- relevância: keyword matching com pesos
  - "LLM", "GPT", "neural" = +0.2
  - "AI", "ML" = +0.1
```

**Resultado:** Top 10 ordenados por score desc

---

### **RF-004: Email Automático Diário**

**Descrição:** Envio automático via SendGrid

| Aspecto | Requisito |
|---------|-----------|
| Horário | 07:00 AM (UTC) |
| Frequência | Diário |
| Destinatário | moraesrayanne94@gmail.com |
| Template | HTML profissional e descontraído |
| Fallback | Se falhar, retry 3x |
| Tracking | Delivery (opcional: open tracking) |

**Custo:**
- SendGrid free tier: 100 emails/dia
- 1 email/dia = **R$ 0,00** ✅

---

### **RF-005: Configuração Flexível**

**Descrição:** Trocar fontes e IA sem código

**Fontes (config/sources.json):**
```json
{
  "enabled": ["devto", "hackernews", "arxiv"],
  "adapters": {
    "devto": { "enabled": true, "priority": 1 },
    "hackernews": { "enabled": true, "priority": 2 },
    "arxiv": { "enabled": true, "priority": 3 },
    "medium": { "enabled": false, "priority": 4 }
  }
}
```

**LLMs (config/llm.json):**
```json
{
  "active": "gemini",
  "providers": {
    "gemini": { 
      "enabled": true,
      "model": "gemini-pro",
      "config": { "maxTokens": 300 }
    },
    "openai": { "enabled": false },
    "claude": { "enabled": false }
  }
}
```

**Customização de Tom (config/ai-style.json):**
```json
{
  "tone": "descontraído",
  "language": "português",
  "style": "técnico mas acessível",
  "preferences": {
    "includeNumbers": true,
    "avoidClichés": ["interessantemente", "vale notar"],
    "maxLines": 5
  }
}
```

---

## 🔧 Requisitos Técnicos

### **RT-001: Arquitetura**

```
GitHub Actions (Scheduler - 07:00 AM)
    ↓
Node.js + TypeScript (Runtime)
    ↓
├─ Aggregator (Busca artigos de 3 fontes)
├─ Deduplicator (Remove duplicatas)
├─ Summarizer (Gemini Pro)
├─ Ranker (Scoring)
├─ Formatter (Email HTML)
└─ Sender (SendGrid)
    ↓
Supabase PostgreSQL
├─ articles (histórico)
├─ digests (emails enviados)
└─ digest_stats (metadados)
    ↓
Email (inbox)
    ↓
Website v1.5+ (React/Vercel)
└─ Consome mesmo Supabase
```

---

### **RT-002: Stack Tecnológico**

| Camada | Tecnologia | Versão | Razão | Custo |
|--------|-----------|--------|-------|-------|
| Runtime | Node.js | 18+ LTS | Speed, ecosystem | Grátis |
| Language | TypeScript | 5.3+ | Type safety | Grátis |
| HTTP | axios | 1.6+ | Simplicity | Grátis |
| HTML Parse | cheerio | 1.0+ | Lightweight | Grátis |
| Database | Supabase | Latest | PostgreSQL + free tier | **R$ 0** |
| ORM | Prisma | 5.0+ | Type-safe | Grátis |
| Email | SendGrid SDK | Latest | 100 emails/dia free | **R$ 0** |
| AI | Google SDK | Latest | Gemini free tier | **R$ 0** |
| Scheduling | GitHub Actions | - | 2000 min/mês | **R$ 0** |
| Testing | Jest | 29+ | Standard | Grátis |
| Frontend | React + Vite | Latest | Modern, fast | Grátis |
| Deploy Frontend | Vercel | Latest | Free tier | **R$ 0** |
| **TOTAL** | | | | **R$ 0,00/mês** |

---

### **RT-003: Performance Requirements**

| Métrica | Target | Máximo |
|---------|--------|--------|
| Tempo Total Execução | < 10 min | 15 min |
| Tempo Aggregation | < 3 min | 5 min |
| Tempo Summarization | < 5 min | 8 min |
| Tempo Ranking | < 1 min | 2 min |
| Tempo Email Send | < 1 min | 2 min |
| Latência DB | < 100ms | 500ms |
| Taxa Sucesso | > 95% | - |
| Website Load Time | < 2s | 3s |
| Website TTL (Time to Live) | 24h | - |

---

### **RT-004: Reliability**

- **Uptime Target:** 99% (1 falha/mês aceitável)
- **Retry Logic:** Até 3 tentativas em falhas
- **Error Handling:** Logs estruturados + alertas
- **Data Persistence:** Todos os artigos salvos em Supabase
- **Idempotency:** Não duplicar se rodado 2x mesmo dia
- **Fallback Email:** Se Gemini falhar, usar resumo simples

---

### **RT-005: Security**

- **API Keys:** Armazenadas em GitHub Secrets
- **Database:** Supabase com RLS (row-level security)
- **Email:** Validação de sender no SendGrid
- **Logging:** Nenhuma chave exposta em logs
- **Website:** Public read-only (sem credentials expostas)

---

### **RT-006: Escalabilidade**

- **v1.0:** Um usuário, email diário, backend GitHub Actions
- **v1.5:** Website público reutiliza dados do Supabase
- **v2.0+:** Suporta múltiplos usuários (apenas trocar SendGrid para multi-recipient)

**Design:** Arquitetura preparada para escalar sem refazer

---

## 📈 Métricas de Sucesso

### **Métricas de Uso (v1.0)**

| Métrica | Meta | Periodicidade |
|---------|------|---------------|
| Emails entregues/dia | 100% | Diário |
| Taxa abertura email | > 60% (esperado) | Semanal |
| Click-through rate | > 30% | Semanal |

### **Métricas Técnicas**

| Métrica | Meta | Periodicidade |
|---------|------|---------------|
| Taxa sucesso | > 95% | Diário |
| Tempo execução | < 10 min | Diário |
| Uptime | > 99% | Mensal |
| Custo/mês | R$ 0,00 | Mensal |

### **Métricas de Qualidade**

| Métrica | Meta | Método |
|---------|------|--------|
| Relevância artigos | 8.5/10 | Human review 10% amostra |
| Qualidade resumos | 8.5/10 | Human review 10% amostra |
| Taxa duplicatas | < 1% | Automático |
| Taxa erro agregação | < 2% | Logs |

---

## 📅 Roadmap

### **v1.0 - MVP ✅**
- ✅ Email diário automático (07:00 AM)
- ✅ 3 fontes (DevTo, HackerNews, ArXiv)
- ✅ Resumos Gemini Pro (gratuito)
- ✅ Top 10 ranking por relevância
- ✅ Histórico em Supabase
- ✅ Configuração flexível (sources.json, llm.json)
- ✅ Customização de tom via prompt engineering
- **Custo:** R$ 0,00/mês

### **v1.1 - Polish**
- [ ] Logging estruturado e alertas
- [ ] Error handling robusto
- [ ] Performance optimization
- [ ] Testes automatizados
- [ ] Documentação completa

### **v1.5 - Website Público**
- [ ] Website React + Vite
- [ ] Mostrar últimos 30 digests
- [ ] Busca por keywords
- [ ] Filtro por fonte
- [ ] Favoritos com localStorage
- [ ] Deploy Vercel
- [ ] SEO básico
- [ ] Responsive design (mobile + desktop)
- **Custo:** R$ 0,00/mês

---

## 💰 Custo de Operação (v1.0 + v1.5)

| Serviço | Limit Free Tier | Necessário | Custo Mensal |
|---------|-----------------|-----------|-------------|
| GitHub Actions | 2000 min/mês | ~1-2 min/dia | **R$ 0** |
| Supabase | 500 MB + reads/writes | ~1 MB + 1000 queries | **R$ 0** |
| SendGrid | 100 emails/dia | 1 email/dia | **R$ 0** |
| Gemini Pro | 60 requests/min | ~35 requests/dia | **R$ 0** |
| Vercel (Frontend) | 100 GB/mês | ~10 GB/mês | **R$ 0** |
| **TOTAL** | | | **R$ 0,00** |

**Conclusão:** Operação completamente gratuita indefinidamente ✅

---

## 🎯 Definição de Pronto (Definition of Done)

Um feature é "pronto" quando:

- [ ] Código escrito (TypeScript, 100% typed)
- [ ] Testes unitários (Jest, > 80% coverage)
- [ ] Testes integração (end-to-end)
- [ ] Code review ✅
- [ ] Documentação atualizada
- [ ] Deploy em staging testado
- [ ] Logs estruturados
- [ ] Error handling implementado
- [ ] Performance checado
- [ ] Security review (se relevante)
- [ ] Documentação user-facing
- [ ] Nenhum TODO comment

---

## 🚫 Out of Scope (v1.0)

- ❌ Website público (v1.5)
- ❌ Mobile app (futuro)
- ❌ Autenticação de usuários (v2.0+)
- ❌ Monetização (v3.0)
- ❌ Recomendações ML (v3.0)
- ❌ Integrações em tempo real (v3.0)

---

## 📚 Apêndices

### **A. Glossário**

- **Digest:** Email com 10 artigos resumidos
- **Adapter:** Interface para buscar artigos de uma fonte
- **LLM:** Large Language Model (Gemini, GPT, Claude)
- **Score:** Relevância calculada do artigo (0-1.2)
- **Dedup:** Remoção de artigos duplicados
- **Supabase:** Backend PostgreSQL com free tier
- **localStorage:** Armazenamento local no navegador do usuário

### **B. Referências Externas**

- **Dev.to API:** https://developers.forem.com/
- **HackerNews API:** https://github.com/HackerNews/API
- **ArXiv API:** https://arxiv.org/help/api/
- **Supabase Docs:** https://supabase.com/docs
- **SendGrid Docs:** https://sendgrid.com/docs/
- **Gemini API:** https://ai.google.dev/gemini-api/docs
- **Prisma Docs:** https://www.prisma.io/docs/

### **C. Decision Log**

| Data | Decisão | Razão |
|------|---------|-------|
| 2024-01 | Usar GitHub Actions | Grátis, nativo, simples |
| 2024-04 | Usar Gemini Pro | Qualidade boa, **100% gratuito** |
| 2024-04 | Usar Supabase | PostgreSQL free tier generous |
| 2024-01 | Arquitetura flexível | Fácil escalar (fontes e LLMs) |
| 2024-01 | Config JSON | Sem código = fácil manutenção |
| 2024-04 | Website público | Reutiliza dados do Supabase |
| 2024-04 | localStorage para favoritos | Sem backend, sem auth necessária |

---

## ✅ Sign-off

**PRD Aprovado por:** Rayanne  
**Data:** Abril 2024  
**Versão:** 1.1  
**Status:** Ready for Development ✅

---

## 🚀 Próximos Passos

1. ✅ PRD aprovado (v1.1)
2. Criar boilerplate GitHub com estrutura base
3. Setup Supabase (schema + permissões)
4. Começar Sprint 1 (Aggregator + Summarizer)

---

**💡 Nota Importante:** Este projeto é **100% gratuito indefinidamente**. Nenhum custo operacional necessário.