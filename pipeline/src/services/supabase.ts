import { getSupabaseClient, _resetClientForTest, ArticleRow, DigestRow } from '@daily/db';
import { SummarizedArticle } from '../types';

export { _resetClientForTest };

export async function getSentUrls(days = 30): Promise<string[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await getSupabaseClient()
    .from('articles')
    .select('url')
    .gte('created_at', since.toISOString());

  if (error) throw error;
  return (data ?? []).map((row: Pick<ArticleRow, 'url'>) => row.url);
}

export async function saveDigest(articles: SummarizedArticle[]): Promise<void> {
  const supabase = getSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);

  const articleRows = articles.map((a) => ({
    url: a.url,
    title: a.title,
    translated_title: a.translatedTitle ?? null,
    source: a.source,
    summary: a.summary ?? null,
    score: a.score ?? null,
    published_at: a.publishedAt.toISOString(),
  }));

  const { data: upsertedArticles, error: articleError } = await supabase
    .from('articles')
    .upsert(articleRows, { onConflict: 'url' })
    .select('id, url');

  if (articleError) throw articleError;

  const { data: digestData, error: digestError } = await supabase
    .from('digests')
    .upsert(
      { date: today, article_count: articles.length, sent_at: new Date().toISOString() },
      { onConflict: 'date' }
    )
    .select('id')
    .single();

  if (digestError) throw digestError;

  await supabase.from('digest_articles').delete().eq('digest_id', (digestData as Pick<DigestRow, 'id'>).id);

  const digestArticleRows = (upsertedArticles ?? []).map(
    (row: Pick<ArticleRow, 'id' | 'url'>, index: number) => ({
      digest_id: (digestData as Pick<DigestRow, 'id'>).id,
      article_id: row.id,
      position: index + 1,
    })
  );

  const { error: joinError } = await supabase.from('digest_articles').insert(digestArticleRows);

  if (joinError) throw joinError;
}
