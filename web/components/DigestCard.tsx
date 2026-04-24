'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { DigestListItem } from '@/types/digest';

const MONTHS_SHORT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

const Article = styled.article<{ $hovered: boolean; $delay: number }>`
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${(p) => p.$delay}ms;
  transition: transform 0.2s ease;
  transform: ${(p) => (p.$hovered ? 'translateX(4px)' : 'translateX(0)')};
  text-decoration: none;
  display: block;
  color: inherit;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const DateCol = styled.div`
  min-width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3px;
`;

const TodayBadge = styled.span`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: white;
  background: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 6px;
`;

const DayNumber = styled.span<{ $hovered: boolean }>`
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 400;
  color: ${(p) => (p.$hovered ? 'var(--accent)' : 'var(--text-primary)')};
  line-height: 1;
  transition: color 0.2s;
`;

const MonthLabel = styled.span`
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 2px;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const MetaText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
`;

const Dot = styled.span`
  color: var(--border-strong);
  font-size: 11px;
`;

const TitleList = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TitleItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const TitleNum = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 14px;
  opacity: 0.7;
`;

const TitleText = styled.span`
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MoreText = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
`;

const Arrow = styled.div<{ $hovered: boolean }>`
  color: ${(p) => (p.$hovered ? 'var(--accent)' : 'var(--border-strong)')};
  transition: all 0.2s;
  transform: ${(p) => (p.$hovered ? 'translateX(3px)' : 'translateX(0)')};
  padding-top: 4px;
  flex-shrink: 0;
`;

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
