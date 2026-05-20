import { validateEnv } from './env';

const REQUIRED = ['GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY'];

describe('validateEnv', () => {
  beforeEach(() => {
    REQUIRED.forEach((k) => (process.env[k] = 'value'));
  });

  afterEach(() => {
    REQUIRED.forEach((k) => delete process.env[k]);
  });

  it('does not throw when all required vars are set', () => {
    expect(() => validateEnv()).not.toThrow();
  });

  it('throws listing missing vars', () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.SUPABASE_KEY;
    expect(() => validateEnv()).toThrow('GEMINI_API_KEY, SUPABASE_KEY');
  });

  it('throws for each missing var individually', () => {
    delete process.env.SUPABASE_URL;
    expect(() => validateEnv()).toThrow('SUPABASE_URL');
  });
});
