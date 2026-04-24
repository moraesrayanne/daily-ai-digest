'use client';

import { Accent, Category, EyebrowDot, H1, Hero, HeroEyebrow, Tagline } from './HomeClient.styles';

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
