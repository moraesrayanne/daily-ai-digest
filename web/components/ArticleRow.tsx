'use client';

import { useState } from 'react';
import { SourcePill } from './SourcePill';
import { ArticleDetail } from '@/types/digest';
import {
  Wrapper,
  RowHeader,
  PosBadge,
  PosNumber,
  MainContent,
  ArticleMeta,
  OriginalDate,
  Title,
  ExpandArrow,
  ExpandedBody,
  SummaryCard,
  Summary,
  ReadLink,
} from './ArticleRow.styles';

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
