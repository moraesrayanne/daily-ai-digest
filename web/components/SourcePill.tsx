'use client';

import styled from 'styled-components';

const SOURCE_CONFIG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  arxiv:      { label: 'arXiv',           bg: '#EEF0FF', color: '#4A55D0', dot: '#4A55D0' },
  hn:         { label: 'Hacker News',     bg: '#FFF0E8', color: '#C04A00', dot: '#C04A00' },
  devto:      { label: 'dev.to',          bg: '#E8F5E9', color: '#2A7A3A', dot: '#2A7A3A' },
  techcrunch: { label: 'TechCrunch',      bg: '#F3E8FF', color: '#7C3AAD', dot: '#7C3AAD' },
  mit:        { label: 'MIT Tech Review', bg: '#E8F4FF', color: '#0A5FA8', dot: '#0A5FA8' },
};

const Pill = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`;

const Dot = styled.span<{ $color: string }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: inline-block;
  flex-shrink: 0;
`;

export function SourcePill({ source }: { source: string }) {
  const cfg = SOURCE_CONFIG[source] ?? { label: source, bg: '#FFF0E8', color: '#C04A00', dot: '#999' };
  return (
    <Pill $bg={cfg.bg} $color={cfg.color}>
      <Dot $color={cfg.dot} />
      {cfg.label}
    </Pill>
  );
}
