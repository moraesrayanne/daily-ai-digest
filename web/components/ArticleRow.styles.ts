'use client';

import styled from 'styled-components';

export const Wrapper = styled.article<{ $delay: number }>`
  border-bottom: 1px solid var(--border);
  animation: slideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${(p) => p.$delay}ms;
`;

export const RowHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 0;
  cursor: pointer;
`;

export const PosBadge = styled.div<{ $pos: number }>`
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

export const PosNumber = styled.span<{ $pos: number }>`
  font-family: var(--font-serif);
  font-size: ${(p) => (p.$pos >= 10 ? '14px' : '16px')};
  font-weight: 400;
  color: ${(p) =>
    p.$pos === 1 ? 'white' : p.$pos <= 3 ? 'var(--accent)' : 'var(--text-muted)'};
`;

export const MainContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
`;

export const OriginalDate = styled.span`
  font-size: 11.5px;
  color: var(--text-muted);
`;

export const Title = styled.h2<{ $hovered: boolean }>`
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 400;
  line-height: 1.4;
  color: ${(p) => (p.$hovered ? 'var(--accent)' : 'var(--text-primary)')};
  transition: color 0.15s;
  letter-spacing: -0.005em;
`;

export const ExpandArrow = styled.div<{ $expanded: boolean }>`
  color: ${(p) => (p.$expanded ? 'var(--accent)' : 'var(--border-strong)')};
  transition: all 0.2s;
  transform: ${(p) => (p.$expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
  flex-shrink: 0;
  padding-top: 6px;
`;

export const ExpandedBody = styled.div`
  padding: 0 0 24px 52px;
  animation: fadeIn 0.4s ease both;
`;

export const SummaryCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 24px;
`;

export const Summary = styled.p`
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 18px;
`;

export const ReadLink = styled.a`
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
