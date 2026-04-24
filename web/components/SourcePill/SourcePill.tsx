'use client';

import { SOURCE_COLORS, DEFAULT_SOURCE_COLOR } from '@/styles/tokens';
import { Pill, Dot } from './SourcePill.styles';

const SOURCE_LABELS: Record<string, string> = {
  arxiv:      'arXiv',
  hn:         'Hacker News',
  devto:      'dev.to',
  techcrunch: 'TechCrunch',
  mit:        'MIT Tech Review',
};

export function SourcePill({ source }: { source: string }) {
  const colors = SOURCE_COLORS[source] ?? DEFAULT_SOURCE_COLOR;
  const label = SOURCE_LABELS[source] ?? source;
  const dot = SOURCE_COLORS[source]?.color ?? '#999';
  return (
    <Pill $bg={colors.bg} $color={colors.color}>
      <Dot $color={dot} />
      {label}
    </Pill>
  );
}
