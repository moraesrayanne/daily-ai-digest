'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DigestListItem } from '@/types/digest';
import { MONTHS_SHORT } from '@/lib/formatDate';
import {
  Article,
  Row,
  DateCol,
  TodayBadge,
  DayNumber,
  MonthLabel,
  Content,
  Meta,
  MetaText,
  Dot,
  TitleList,
  TitleItem,
  TitleNum,
  TitleText,
  MoreText,
  Arrow,
} from './DigestCard.styles';

interface DigestCardProps {
  digest: DigestListItem;
  index: number;
}

export function DigestCard({ digest, index }: DigestCardProps) {
  const [hovered, setHovered] = useState(false);
  const [year, month, day] = digest.date.split('-').map(Number);

  return (
    <Link href={`/digest/${digest.date}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
    <Article
      $hovered={hovered}
      $delay={index * 60}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Row>
        <DateCol>
          {digest.isToday && <TodayBadge>Hoje</TodayBadge>}
          <DayNumber $hovered={hovered}>{String(day).padStart(2, '0')}</DayNumber>
          <MonthLabel>{MONTHS_SHORT[month - 1]}</MonthLabel>
        </DateCol>

        <Content>
          <Meta>
            <MetaText>{digest.dateShort}</MetaText>
            <Dot>·</Dot>
            <MetaText>Publicado às {digest.sentAt}</MetaText>
            <Dot>·</Dot>
            <MetaText>{digest.articleCount} artigos</MetaText>
          </Meta>

          <TitleList>
            {digest.titles.slice(0, 5).map((title, i) => (
              <TitleItem key={i}>
                <TitleNum>{i + 1}</TitleNum>
                <TitleText>{title}</TitleText>
              </TitleItem>
            ))}
            {digest.titles.length > 5 && (
              <TitleItem>
                <TitleNum />
                <MoreText>+ {digest.titles.length - 5} mais artigos</MoreText>
              </TitleItem>
            )}
          </TitleList>
        </Content>

        <Arrow $hovered={hovered}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Arrow>
      </Row>
    </Article>
    </Link>
  );
}
