const FULL_REQUIRED = ['GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY'] as const;

export function validateEnv(): void {
  if (process.env.SKIP_SUMMARIZE === 'true') return;

  const missing = FULL_REQUIRED.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
