import { Article } from '../types';

const HIGH_KEYWORDS = /\b(LLM|GPT|neural)\b/i;
const MED_KEYWORDS = /\b(AI|ML)\b/i;

function recencyScore(publishedAt: Date, now: Date): number {
  const ageMs = now.getTime() - publishedAt.getTime();
  const ageH = ageMs / (1000 * 60 * 60);
  if (ageH <= 12) return 1.0;
  if (ageH >= 24) return 0.0;
  return 1.0 - (ageH - 12) / 12;
}

function relevanceScore(title: string): number {
  let score = 0;
  if (HIGH_KEYWORDS.test(title)) score += 0.2;
  if (MED_KEYWORDS.test(title)) score += 0.1;
  return Math.min(score, 1.0);
}

export function rank(articles: Article[], now: Date = new Date()): Article[] {
  if (articles.length === 0) return [];

  const trendingValues = articles.map((a) => a.views + a.comments);
  const maxTrending = Math.max(...trendingValues);

  const scored = articles.map((article) => {
    const recency = recencyScore(article.publishedAt, now);
    const trending = maxTrending > 0 ? (article.views + article.comments) / maxTrending : 0;
    const relevance = relevanceScore(article.title);
    const score = recency * 0.3 + trending * 0.4 + relevance * 0.3;
    return { ...article, score };
  });

  return scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 10);
}
