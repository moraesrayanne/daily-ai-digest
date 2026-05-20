import { SummarizedArticle } from '../types';

const SEPARATOR = '─'.repeat(72);
const THICK_SEPARATOR = '═'.repeat(72);

function formatScore(score: number): string {
  const filled = Math.round(score * 10);
  return `[${'█'.repeat(filled)}${'░'.repeat(10 - filled)}] ${(score * 100).toFixed(0)}%`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function printDigest(articles: SummarizedArticle[]): void {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  console.log('');
  console.log(THICK_SEPARATOR);
  console.log('  DAILY AI DIGEST — DRY RUN (SKIP_SUMMARIZE=true)');
  console.log(`  ${today}`);
  console.log(`  ${articles.length} artigos selecionados — banco de dados NÃO atualizado`);
  console.log(THICK_SEPARATOR);

  articles.forEach((article, index) => {
    console.log('');
    console.log(
      `  #${String(index + 1).padStart(2, '0')}  ${article.translatedTitle || article.title}`
    );
    console.log(SEPARATOR);
    console.log(`  Fonte    : ${article.source}`);
    console.log(`  Score    : ${formatScore(article.score)}`);
    console.log(`  Data     : ${formatDate(article.publishedAt)}`);
    console.log(
      `  Views    : ${article.views.toLocaleString('pt-BR')}   Comentários: ${article.comments}`
    );
    console.log(`  URL      : ${article.url}`);
    if (article.summary) {
      console.log(`  Resumo   : ${article.summary}`);
    }
  });

  console.log('');
  console.log(THICK_SEPARATOR);
  console.log('  FIM DO DRY RUN — nenhum dado foi salvo no Supabase');
  console.log(THICK_SEPARATOR);
  console.log('');
}
