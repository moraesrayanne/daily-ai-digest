import 'dotenv/config';
import { runPipeline } from './pipeline';

runPipeline().catch((err) => {
  console.error('[orchestrator] fatal error:', err);
  process.exit(1);
});
