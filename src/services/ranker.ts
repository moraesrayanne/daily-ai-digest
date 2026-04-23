import { Article } from '../types';

// Tier 1 — model releases, major research breakthroughs (+0.35)
const TIER1 = /\b(GPT-\d|Claude\s*\d|Gemini\s*[\d.]+|LLaMA\s*\d|Mistral|Grok|o1|o3|AlphaFold|Sora|Gemma|Phi-\d|DeepSeek|Qwen)\b|benchmark|state[- ]of[- ]the[- ]art|SOTA|surpass|beats|outperform|breakthrough|emergent|alignment/i;

// Tier 2 — companies, hardware, applied research (+0.2)
const TIER2 = /\b(OpenAI|Anthropic|DeepMind|Google\s*AI|Meta\s*AI|Microsoft\s*AI|NVIDIA|Trainium|Copilot|Perplexity|Hugging\s*Face|LLM|GPT|neural|transformer|diffusion|fine.tun|open.source|open-weight)\b/i;

// Tier 3 — general AI/ML signal (+0.1)
const TIER3 = /\b(AI|ML|machine\s*learning|deep\s*learning|language\s*model|chip|autonomous|robot|inference|agent)\b/i;

// Negative signal — tutorials, listicles, beginner content (−0.2)
const LOW_VALUE = /\b(tutorial|how\s*to|beginner|getting\s*started|introduction\s*to|top\s*\d+\s*(tools|tips|ways)|vs\s*code|course|learn\s*(python|javascript))\b/i;

function recencyScore(publishedAt: Date, now: Date): number {
  const ageMs = now.getTime() - publishedAt.getTime();
  const ageH = ageMs / (1000 * 60 * 60);
  if (ageH <= 12) return 1.0;
  if (ageH >= 24) return 0.0;
  return 1.0 - (ageH - 12) / 12;
}

// Sources whose content is already curated — always high signal
const PREMIUM_SOURCES = new Set([
  'Anthropic', 'OpenAI', 'Google DeepMind', 'Cursor',
  'The Verge AI', 'TechCrunch AI',
]);

function relevanceScore(title: string, source: string): number {
  let score = 0;
  if (PREMIUM_SOURCES.has(source)) score += 0.5; // premium source bonus
  if (TIER1.test(title))           score += 0.35;
  if (TIER2.test(title))           score += 0.2;
  if (TIER3.test(title))           score += 0.1;
  if (LOW_VALUE.test(title))       score -= 0.2;
  return Math.max(0, Math.min(score, 1.0));
}

export function rank(articles: Article[], now: Date = new Date()): Article[] {
  if (articles.length === 0) return [];

  const trendingValues = articles.map((a) => a.views + a.comments);
  const maxTrending = Math.max(...trendingValues);

  const scored = articles.map((article) => {
    const recency = recencyScore(article.publishedAt, now);
    const trending = maxTrending > 0 ? (article.views + article.comments) / maxTrending : 0;
    const relevance = relevanceScore(article.title, article.source);
    const score = recency * 0.3 + trending * 0.4 + relevance * 0.3;
    return { ...article, score };
  });

  return scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 10);
}
