// Server-side only — do not import in client components
import { createClient } from '@supabase/supabase-js';

export function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
}
