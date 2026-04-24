'use client';

import styled from 'styled-components';

const Hero = styled.div`
  padding: 52px 0 36px;
  border-bottom: 1px solid var(--border);
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const HeroEyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Category = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
`;

const EyebrowDot = styled.span`
  color: var(--border-strong);
  font-size: 12px;
`;

const Tagline = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.04em;
`;

const H1 = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(32px, 5vw, 46px);
  font-weight: 400;
  line-height: 1.15;
  color: var(--text-primary);
  letter-spacing: -0.01em;
`;

const Accent = styled.em`
  color: var(--accent);
`;

export function HomeClient() {
  return (
    <Hero>
      <HeroEyebrow>
        <Category>Inteligência Artificial</Category>
        <EyebrowDot>·</EyebrowDot>
        <Tagline>Top 10 artigos do dia, todos os dias às 07:00</Tagline>
      </HeroEyebrow>
      <H1>
        O que importa em IA,<br />
        <Accent>curado todo dia para você.</Accent>
      </H1>
    </Hero>
  );
}
