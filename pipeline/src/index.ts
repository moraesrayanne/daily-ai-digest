import 'dotenv/config';
import { validateEnv } from './lib/env';
import { runPipeline } from './pipeline';

validateEnv();

runPipeline().catch((err) => {
  console.error('[orchestrator] fatal error:', err);
  process.exit(1);
});
