import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Article } from '../types';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url) throw new Error('SUPABASE_URL is not set');
  if (!key) throw new Error('SUPABASE_KEY is not set');
  _client = createClient(url, key);
  return _client;
}

export function _resetClientForTest(): void {
  _client = null;
}

export async function getSentUrls(days = 30): Promise<string[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await getClient()
    .from('articles')
    .select('url')
    .gte('created_at', since.toISOString());

  if (error) throw error;
  return (data ?? []).map((row: { url: string }) => row.url);
}

export async function saveDigest(articles: Article[]): Promise<void> {
  const supabase = getClient();
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
    .upsert({ date: today, article_count: articles.length, sent_at: new Date().toISOString() }, { onConflict: 'date' })
    .select('id')
    .single();

  if (digestError) throw digestError;

  await supabase.from('digest_articles').delete().eq('digest_id', digestData.id);

  const digestArticleRows = (upsertedArticles ?? []).map((row: { id: string; url: string }, index: number) => ({
    digest_id: digestData.id,
    article_id: row.id,
    position: index + 1,
  }));

  const { error: joinError } = await supabase
    .from('digest_articles')
    .insert(digestArticleRows);

  if (joinError) throw joinError;
}
