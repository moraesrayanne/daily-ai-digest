import { aggregate } from './services/aggregator';
import { deduplicate, deduplicateWithHistory } from './services/deduplicator';
import { rank } from './services/ranker';
import { summarizeAll } from './services/summarizer';
import { getSentUrls, saveDigest } from './services/supabase';
import { log, warn } from './lib/logger';
import { printDigest } from './lib/print-digest';

const isDryRun = () => process.env.SKIP_SUMMARIZE === 'true';

export async function runPipeline(): Promise<void> {
  const dryRun = isDryRun();

  if (dryRun) {
    log('orchestrator', 'dry-run mode (SKIP_SUMMARIZE=true) — banco de dados será ignorado');
  }

  log('aggregate', 'start');
  const raw = await aggregate();
  log('aggregate', `fetched ${raw.length} articles`);

  log('deduplicate', 'start');
  const sentUrls = dryRun ? [] : await getSentUrls();
  const unique = deduplicateWithHistory(deduplicate(raw), sentUrls);
  log('deduplicate', `${unique.length} articles after dedup`);

  if (unique.length < 10) {
    warn('deduplicate', `only ${unique.length} articles available (expected 10)`);
  }

  if (unique.length === 0) {
    throw new Error('no articles to send after deduplication');
  }

  log('rank', 'start');
  const ranked = rank(unique);
  log('rank', `top ${ranked.length} selected`);

  log('summarize', 'start');
  const summarized = await summarizeAll(ranked);
  log('summarize', 'done');

  if (dryRun) {
    printDigest(summarized);
    log('orchestrator', 'dry-run complete — nenhum dado salvo');
    return;
  }

  log('save', 'start');
  await saveDigest(summarized);
  log('save', 'digest saved to Supabase');

  log('orchestrator', 'pipeline complete');
}
