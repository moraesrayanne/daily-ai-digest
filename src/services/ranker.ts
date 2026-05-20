import { Article, RankedArticle } from '../types';

const TIER1 = /\b(GPT-\d|Claude\s*\d|Gemini\s*[\d.]+|LLaMA\s*\d|Mistral|Grok|o1|o3|AlphaFold|Sora|Gemma|Phi-\d|DeepSeek|Qwen)\b|benchmark|state[- ]of[- ]the[- ]art|SOTA|surpass|beats|outperform|breakthrough|emergent|alignment/i;
const TIER2 = /\b(OpenAI|Anthropic|DeepMind|Google\s*AI|Meta\s*AI|Microsoft\s*AI|NVIDIA|Trainium|Copilot|Perplexity|Hugging\s*Face|LLM|GPT|neural|transformer|diffusion|fine.tun|open.source|open-weight)\b/i;
const TIER3 = /\b(AI|ML|machine\s*learning|deep\s*learning|language\s*model|chip|autonomous|robot|inference|agent)\b/i;
const LOW_VALUE = /\b(tutorial|how\s*to|beginner|getting\s*started|introduction\s*to|top\s*\d+\s*(tools|tips|ways)|vs\s*code|course|learn\s*(python|javascript))\b/i;

const PREMIUM_SOURCES = new Set([
  'Anthropic', 'OpenAI', 'Google DeepMind', 'Cursor',
  'The Verge AI', 'TechCrunch AI',
]);

const WEIGHTS = { recency: 0.3, trending: 0.4, relevance: 0.3 } as const;

function recencyScore(publishedAt: Date, now: Date): number {
  const ageH = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60);
  if (ageH <= 12) return 1.0;
  if (ageH >= 24) return 0.0;
  return 1.0 - (ageH - 12) / 12;
}

function relevanceScore(title: string, source: string): number {
  let score = 0;
  if (PREMIUM_SOURCES.has(source)) score += 0.5;
  if (TIER1.test(title))           score += 0.35;
  if (TIER2.test(title))           score += 0.2;
  if (TIER3.test(title))           score += 0.1;
  if (LOW_VALUE.test(title))       score -= 0.2;
  return Math.max(0, Math.min(score, 1.0));
}

function scoreArticle(article: Article, maxTrending: number, now: Date): number {
  const recency = recencyScore(article.publishedAt, now);
  const trending = maxTrending > 0 ? (article.views + article.comments) / maxTrending : 0;
  const relevance = relevanceScore(article.title, article.source);
  return recency * WEIGHTS.recency + trending * WEIGHTS.trending + relevance * WEIGHTS.relevance;
}

export function rank(articles: Article[], now: Date = new Date()): RankedArticle[] {
  if (articles.length === 0) return [];

  const maxTrending = Math.max(...articles.map((a) => a.views + a.comments));

  return articles
    .map((article) => ({ ...article, score: scoreArticle(article, maxTrending, now) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
