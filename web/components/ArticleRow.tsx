'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { SourcePill } from './SourcePill';
import { ArticleDetail } from '@/types/digest';

const Wrapper = styled.article<{ $delay: number }>`
  border-bottom: 1px solid var(--border);
  animation: slideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${(p) => p.$delay}ms;
`;

const RowHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 0;
  cursor: pointer;
`;

const PosBadge = styled.div<{ $pos: number }>`
  min-width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${(p) =>
    p.$pos === 1
      ? 'var(--accent)'
      : p.$pos === 2
        ? 'var(--accent-mid)'
        : p.$pos === 3
          ? 'var(--accent-light)'
          : 'var(--bg-hover)'};
  border: ${(p) => (p.$pos === 2 || p.$pos === 3) ? '1px solid var(--border)' : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
`;

const PosNumber = styled.span<{ $pos: number }>`
  font-family: var(--font-serif);
  font-size: ${(p) => (p.$pos >= 10 ? '14px' : '16px')};
  font-weight: 400;
  color: ${(p) =>
    p.$pos === 1 ? 'white' : p.$pos <= 3 ? 'var(--accent)' : 'var(--text-muted)'};
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
`;

const OriginalDate = styled.span`
  font-size: 11.5px;
  color: var(--text-muted);
`;

const Title = styled.h2<{ $hovered: boolean }>`
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 400;
  line-height: 1.4;
  color: ${(p) => (p.$hovered ? 'var(--accent)' : 'var(--text-primary)')};
  transition: color 0.15s;
  letter-spacing: -0.005em;
`;

const ExpandArrow = styled.div<{ $expanded: boolean }>`
  color: ${(p) => (p.$expanded ? 'var(--accent)' : 'var(--border-strong)')};
  transition: all 0.2s;
  transform: ${(p) => (p.$expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
  flex-shrink: 0;
  padding-top: 6px;
`;

const ExpandedBody = styled.div`
  padding: 0 0 24px 52px;
  animation: fadeIn 0.4s ease both;
`;

const SummaryCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 24px;
`;

const Summary = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 18px;
`;

const ReadLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--accent);
  text-decoration: none;
  padding: 7px 14px;
  background: var(--accent-light);
  border-radius: 8px;
  transition: all 0.15s;
  border: 1px solid transparent;

  &:hover {
    border-color: var(--accent-mid);
  }
`;

interface ArticleRowProps {
  article: ArticleDetail;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

export function ArticleRow({ article, index, expanded, onToggle }: ArticleRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Wrapper $delay={index * 50}>
      <RowHeader
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <PosBadge $pos={article.pos}>
          <PosNumber $pos={article.pos}>{article.pos}</PosNumber>
        </PosBadge>

        <MainContent>
          <ArticleMeta>
            <SourcePill source={article.source} />
            <OriginalDate>{article.originalDate}</OriginalDate>
          </ArticleMeta>
          <Title $hovered={hovered && !expanded}>{article.title}</Title>
        </MainContent>

        <ExpandArrow $expanded={expanded}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 12L9 8L5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ExpandArrow>
      </RowHeader>

      {expanded && (
        <ExpandedBody>
          <SummaryCard>
            <Summary>{article.summary ?? 'Resumo não disponível.'}</Summary>
            <ReadLink
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Ler artigo original
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ReadLink>
          </SummaryCard>
        </ExpandedBody>
      )}
    </Wrapper>
  );
}
