import { LLMProvider } from './types';
import { GeminiProvider } from './providers/gemini';
import { OpenAIProvider } from './providers/openai';
import { ClaudeProvider } from './providers/claude';
import llmConfig from '../../config/llm.json';

let instance: LLMProvider | null = null;

export function getLLMProvider(): LLMProvider {
  if (instance) return instance;

  const active = llmConfig.active;

  if (active === 'gemini') { instance = new GeminiProvider(); return instance; }
  if (active === 'openai') { instance = new OpenAIProvider(); return instance; }
  if (active === 'claude') { instance = new ClaudeProvider(); return instance; }

  throw new Error(`[llm/factory] Unknown LLM provider: "${active}". Check config/llm.json.`);
}

export function _resetProviderForTest(): void {
  instance = null;
}
