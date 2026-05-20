import axios from 'axios';
import { Article } from '../types';

const BASE = 'https://hacker-news.firebaseio.com/v0';
const AI_KEYWORDS = /\b(AI|LLM|GPT|ML|neural|machine.learning|deep.learning|model|agent|claude|openai|gemini|mistral|llama|grok|deepseek|qwen|phi|transformer|diffusion|benchmark|inference|fine.tun|alignment|chip|nvidia|anthropic|deepmind|autonomous|robot|multimodal|vision|language.model|open.source|weights)\b/i;

interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  descendants: number;
  time: number;
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const { data: ids } = await axios.get<number[]>(`${BASE}/topstories.json`);
    const topIds = ids.slice(0, 100);

    const stories = await Promise.all(
      topIds.map((id) =>
        axios
          .get<HNStory>(`${BASE}/item/${id}.json`)
          .then((r) => r.data)
          .catch(() => null)
      )
    );

    return stories
      .filter((s): s is HNStory => s !== null && !!s.url && AI_KEYWORDS.test(s.title))
      .map((s) => ({
        id: `hn-${s.id}`,
        title: s.title,
        url: s.url!,
        source: 'HackerNews',
        publishedAt: new Date(s.time * 1000),
        views: s.score,
        comments: s.descendants ?? 0,
      }));
  } catch {
    return [];
  }
}
