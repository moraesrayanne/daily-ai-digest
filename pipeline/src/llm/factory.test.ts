import { getLLMProvider, _resetProviderForTest } from './factory';
import { GeminiProvider } from './providers/gemini';

describe('getLLMProvider', () => {
  afterEach(() => {
    _resetProviderForTest();
    delete process.env.LLM_PROVIDER;
  });

  it('returns a GeminiProvider by default', () => {
    const provider = getLLMProvider();
    expect(provider).toBeInstanceOf(GeminiProvider);
  });

  it('returns the same instance on repeated calls (singleton)', () => {
    const a = getLLMProvider();
    const b = getLLMProvider();
    expect(a).toBe(b);
  });

  it('throws for an unknown provider name', () => {
    process.env.LLM_PROVIDER = 'openai';
    expect(() => getLLMProvider()).toThrow('Unknown LLM provider: "openai"');
  });

  it('returns a new instance after reset', () => {
    const a = getLLMProvider();
    _resetProviderForTest();
    const b = getLLMProvider();
    expect(a).not.toBe(b);
  });
});
