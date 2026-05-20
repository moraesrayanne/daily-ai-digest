export interface ArticleRow {
  id: string;
  url: string;
  title: string;
  translated_title: string | null;
  source: string;
  summary: string | null;
  score: number | null;
  published_at: string;
  created_at: string;
}

export interface DigestRow {
  id: string;
  date: string;
  article_count: number | null;
  sent_at: string;
}

export interface DigestArticleRow {
  digest_id: string;
  article_id: string;
  position: number;
}

export interface DigestArticleWithArticle extends DigestArticleRow {
  articles: ArticleRow;
}
