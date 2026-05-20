const REQUIRED = ['GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY'] as const;

export function validateEnv(): void {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
