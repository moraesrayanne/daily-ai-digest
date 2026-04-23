export interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: Date;
  views: number;
  comments: number;
  summary?: string;
  translatedTitle?: string;
  score?: number;
}

export interface Digest {
  date: string;
  articles: Article[];
  sentAt: Date;
}
