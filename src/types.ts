export interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: Date;
  views: number;
  comments: number;
}

export interface RankedArticle extends Article {
  score: number;
}

export interface SummarizedArticle extends RankedArticle {
  summary: string;
  translatedTitle: string;
}

export interface Digest {
  date: string;
  articles: SummarizedArticle[];
}
