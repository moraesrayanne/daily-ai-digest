'use client';

import styled from 'styled-components';
import { Header } from '@/components/Header';

const DayHeader = styled.div`
  padding: 44px 0 36px;
  border-bottom: 1px solid var(--border);
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const DayMeta = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
`;

const TodayBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: white;
  background: var(--accent);
  padding: 3px 8px;
  border-radius: 4px;
`;

const PublishedAt = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
`;

const DayTitle = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(26px, 4vw, 36px);
  font-weight: 400;
  line-height: 1.2;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: 14px;
`;

const Description = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.65;
  max-width: 560px;
`;

interface DigestClientProps {
  dateShort: string;
  dateFormatted: string;
  sentAt: string;
  isToday: boolean;
}

export function DigestClient({ dateShort, dateFormatted, sentAt, isToday }: DigestClientProps) {
  return (
    <div>
      <Header showBack subtitle={dateShort} lastUpdated={sentAt} />
      <DayHeader>
        <DayMeta>
          {isToday && <TodayBadge>Hoje</TodayBadge>}
          <PublishedAt>Publicado em {sentAt}</PublishedAt>
        </DayMeta>
        <DayTitle>Digest de {dateFormatted}</DayTitle>
        <Description>
          Os 10 artigos mais relevantes sobre inteligência artificial das últimas 24 horas, selecionados e resumidos automaticamente.
        </Description>
      </DayHeader>
    </div>
  );
}
