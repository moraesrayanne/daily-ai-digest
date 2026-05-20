import { Article } from '../types';
import { getAdapter } from '../adapters/registry';
import sourcesConfig from '../../config/sources.json';

export async function aggregate(): Promise<Article[]> {
  const enabled = sourcesConfig.sources
    .filter((s) => s.enabled)
    .map((s) => s.name)
    .filter((name) => getAdapter(name) !== undefined);

  const results = await Promise.all(enabled.map((name) => getAdapter(name)!()));
  return results.flat();
}
