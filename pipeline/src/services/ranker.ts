import { Article, RankedArticle } from '../types';
import rankingConfig from '../../config/ranking.json';

const TIER1 = new RegExp(rankingConfig.tiers.tier1.pattern, 'i');
const TIER2 = new RegExp(rankingConfig.tiers.tier2.pattern, 'i');
const TIER3 = new RegExp(rankingConfig.tiers.tier3.pattern, 'i');
const LOW_VALUE = new RegExp(rankingConfig.tiers.lowValue.pattern, 'i');
const PREMIUM_SOURCES = new Set(rankingConfig.premiumSources);

function recencyScore(publishedAt: Date, now: Date): number {
  const ageH = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60);
  if (ageH <= 12) return 1.0;
  if (ageH >= 24) return 0.0;
  return 1.0 - (ageH - 12) / 12;
}

function relevanceScore(title: string, source: string): number {
  let score = 0;
  if (PREMIUM_SOURCES.has(source)) score += rankingConfig.premiumSourceBonus;
  if (TIER1.test(title))           score += rankingConfig.tiers.tier1.score;
  if (TIER2.test(title))           score += rankingConfig.tiers.tier2.score;
  if (TIER3.test(title))           score += rankingConfig.tiers.tier3.score;
  if (LOW_VALUE.test(title))       score += rankingConfig.tiers.lowValue.penalty;
  return Math.max(0, Math.min(score, 1.0));
}

function scoreArticle(article: Article, maxTrending: number, now: Date): number {
  const { weights } = rankingConfig;
  const recency = recencyScore(article.publishedAt, now);
  const trending = maxTrending > 0 ? (article.views + article.comments) / maxTrending : 0;
  const relevance = relevanceScore(article.title, article.source);
  return recency * weights.recency + trending * weights.trending + relevance * weights.relevance;
}

export function rank(articles: Article[], now: Date = new Date()): RankedArticle[] {
  if (articles.length === 0) return [];

  const maxTrending = Math.max(...articles.map((a) => a.views + a.comments));

  return articles
    .map((article) => ({ ...article, score: scoreArticle(article, maxTrending, now) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, rankingConfig.topN);
}
