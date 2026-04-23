import 'dotenv/config';
import { aggregate } from './services/aggregator';
import { deduplicate, deduplicateWithHistory } from './services/deduplicator';
import { rank } from './services/ranker';
import { summarizeAll } from './services/summarizer';
import { format } from './services/formatter';
import { send } from './services/sender';
import { getSentUrls, saveDigest } from './services/supabase';

function log(step: string, msg: string) {
  console.log(`[${step}] ${msg}`);
}

async function run() {
  try {
    log('aggregate', 'start');
    const raw = await aggregate();
    log('aggregate', `fetched ${raw.length} articles`);

    log('deduplicate', 'start');
    const sentUrls = await getSentUrls();
    const unique = deduplicateWithHistory(deduplicate(raw), sentUrls);
    log('deduplicate', `${unique.length} articles after dedup`);

    if (unique.length < 10) {
      console.warn(`[deduplicate] warning: only ${unique.length} articles available (expected 10)`);
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

    log('format', 'start');
    const payload = format(summarized);
    log('format', `subject: ${payload.subject}`);

    log('send', 'start');
    await send(payload);
    log('send', 'email delivered');

    log('save', 'start');
    await saveDigest(summarized);
    log('save', 'digest saved to Supabase');

    log('orchestrator', 'pipeline complete');
  } catch (err) {
    console.error('[orchestrator] fatal error:', err);
    process.exit(1);
  }
}

run();
