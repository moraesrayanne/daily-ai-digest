const ALWAYS_REQUIRED = ['GEMINI_API_KEY'] as const;
const DB_REQUIRED = ['SUPABASE_URL', 'SUPABASE_KEY'] as const;

export function validateEnv(): void {
  const skipSummarize = process.env.SKIP_SUMMARIZE === 'true';

  const required = skipSummarize ? [...ALWAYS_REQUIRED] : [...ALWAYS_REQUIRED, ...DB_REQUIRED];

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
