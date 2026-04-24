'use client';

import { Header } from '@/components/Header';
import { DayHeader, DayMeta, TodayBadge, PublishedAt, DayTitle, Description } from './DigestClient.styles';

interface DigestClientProps {
  dateShort: string;
  dateFormatted: string;
  sentAt: string;
  isToday: boolean;
}

export function DigestClient({ dateShort, dateFormatted, sentAt, isToday }: DigestClientProps) {
  return (
    <div>
      <Header showBack lastUpdated={sentAt} />
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
