import { Article } from '../../types';
import { LLMProvider, SummaryResult } from '../types';

export class OpenAIProvider implements LLMProvider {
  async summarize(_article: Article): Promise<SummaryResult> {
    throw new Error('[llm] OpenAI provider not configured. Set "active": "openai" in config/llm.json and provide OPENAI_API_KEY.');
  }
}
