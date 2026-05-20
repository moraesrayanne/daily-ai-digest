import { Article } from '../types';

export interface SummaryResult {
  title: string;
  summary: string;
}

export interface LLMProvider {
  summarize(article: Article): Promise<SummaryResult>;
}
