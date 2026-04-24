'use client';

import styled from 'styled-components';

export const Article = styled.article<{ $hovered: boolean; $delay: number }>`
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

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

export const DateCol = styled.div`
  min-width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3px;
`;

export const TodayBadge = styled.span`
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

export const DayNumber = styled.span<{ $hovered: boolean }>`
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 400;
  color: ${(p) => (p.$hovered ? 'var(--accent)' : 'var(--text-primary)')};
  line-height: 1;
  transition: color 0.2s;
`;

export const MonthLabel = styled.span`
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 2px;
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const MetaText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
`;

export const Dot = styled.span`
  color: var(--border-strong);
  font-size: 11px;
`;

export const TitleList = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const TitleItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

export const TitleNum = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 14px;
  opacity: 0.7;
`;

export const TitleText = styled.span`
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MoreText = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
`;

export const Arrow = styled.div<{ $hovered: boolean }>`
  color: ${(p) => (p.$hovered ? 'var(--accent)' : 'var(--border-strong)')};
  transition: all 0.2s;
  transform: ${(p) => (p.$hovered ? 'translateX(3px)' : 'translateX(0)')};
  padding-top: 4px;
  flex-shrink: 0;
`;
