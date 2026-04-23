import { Article } from '../../types';
import { LLMProvider, SummaryResult } from '../types';

export class ClaudeProvider implements LLMProvider {
  async summarize(_article: Article): Promise<SummaryResult> {
    throw new Error('[llm] Claude provider not configured. Set "active": "claude" in config/llm.json and provide ANTHROPIC_API_KEY.');
  }
}
