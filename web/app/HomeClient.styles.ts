'use client';

import styled from 'styled-components';

export const Hero = styled.div`
  padding: 52px 0 36px;
  border-bottom: 1px solid var(--border);
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

export const HeroEyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const Category = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
`;

export const EyebrowDot = styled.span`
  color: var(--border-strong);
  font-size: 12px;
`;

export const Tagline = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.04em;
`;

export const H1 = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(32px, 5vw, 46px);
  font-weight: 400;
  line-height: 1.15;
  color: var(--text-primary);
  letter-spacing: -0.01em;
`;

export const Accent = styled.em`
  color: var(--accent);
`;
