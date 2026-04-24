export interface DigestListItem {
  date: string;
  dateFormatted: string;
  dateShort: string;
  sentAt: string;
  isToday: boolean;
  articleCount: number;
  titles: string[];
}

export interface ArticleDetail {
  pos: number;
  source: string;
  title: string;
  summary: string | null;
  originalDate: string;
  url: string;
}

export interface DigestDetail {
  date: string;
  dateFormatted: string;
  dateShort: string;
  publishedAt: string;
  isToday: boolean;
  articles: ArticleDetail[];
}
