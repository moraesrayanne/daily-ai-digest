import { LLMProvider } from './types';
import { GeminiProvider } from './providers/gemini';

let instance: LLMProvider | null = null;

const providers: Record<string, () => LLMProvider> = {
  gemini: () => new GeminiProvider(),
};

export function getLLMProvider(): LLMProvider {
  if (instance) return instance;

  const active = process.env.LLM_PROVIDER ?? 'gemini';
  const factory = providers[active];

  if (!factory) {
    throw new Error(`[llm/factory] Unknown LLM provider: "${active}". Available: ${Object.keys(providers).join(', ')}.`);
  }

  instance = factory();
  return instance;
}

export function _resetProviderForTest(): void {
  instance = null;
}
