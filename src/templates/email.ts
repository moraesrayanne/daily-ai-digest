import { Article } from '../types';

const ACCENT = '#d44a1c';
const BG = '#f5f4ef';
const BORDER = '#e0ddd5';
const TEXT_DARK = '#1a1a18';
const TEXT_MID = '#555550';
const TEXT_LIGHT = '#888882';

const SOURCE_LABEL: Record<string, string> = {
  DevTo: 'Dev.to',
  HackerNews: 'Hacker News',
  ArXiv: 'ArXiv',
};

function articleRow(article: Article, index: number): string {
  const source = SOURCE_LABEL[article.source] ?? article.source;
  const summary = article.summary && article.summary !== article.title
    ? `<p style="margin:4px 0 0 28px;font-size:13px;line-height:1.6;color:${TEXT_MID};">${article.summary}</p>`
    : '';

  return `
  <tr>
    <td style="padding:14px 0;border-bottom:1px solid ${BORDER};vertical-align:top;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="width:24px;vertical-align:top;padding-top:1px;">
            <span style="font-size:12px;color:${ACCENT};font-weight:700;font-family:Georgia,serif;">${index + 1}</span>
          </td>
          <td style="vertical-align:top;">
            <a href="${article.url}" style="font-size:15px;line-height:1.45;color:${TEXT_DARK};text-decoration:none;font-family:Georgia,'Times New Roman',serif;font-weight:400;">${article.title}</a>
            <span style="margin-left:8px;font-size:11px;color:${TEXT_LIGHT};font-family:Arial,sans-serif;">${source}</span>
            ${summary}
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export function buildEmailHtml(articles: Article[], date: string): string {
  const rows = articles.map((a, i) => articleRow(a, i)).join('');
  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Daily AI Digest</title>
</head>
<body style="margin:0;padding:0;background:${BG};">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};">
  <tr><td align="center" style="padding:0 16px;">
  <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

    <!-- Header -->
    <tr>
      <td style="padding:20px 0;border-bottom:1px solid ${BORDER};">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${ACCENT};border-radius:6px;width:30px;height:30px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:16px;line-height:30px;">★</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="font-size:16px;font-weight:700;color:${TEXT_DARK};font-family:Georgia,'Times New Roman',serif;letter-spacing:-0.3px;">Daily AI Digest</span>
                  </td>
                </tr>
              </table>
            </td>
            <td align="right">
              <span style="font-size:12px;color:#3a9e5f;font-family:Arial,sans-serif;">● Atualizado ${timeStr}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Hero -->
    <tr>
      <td style="padding:36px 0 28px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:${ACCENT};font-family:Arial,sans-serif;text-transform:uppercase;">Inteligência Artificial</p>
        <p style="margin:0 0 6px;font-size:11px;color:${TEXT_LIGHT};font-family:Arial,sans-serif;">· Top 10 artigos do dia, todos os dias às 07:00</p>
        <h1 style="margin:16px 0 0;font-size:36px;line-height:1.15;color:${TEXT_DARK};font-family:Georgia,'Times New Roman',serif;font-weight:400;">O que importa em IA,</h1>
        <h1 style="margin:0;font-size:36px;line-height:1.15;color:${ACCENT};font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:400;">curado todo dia para você.</h1>
      </td>
    </tr>

    <!-- Date bar -->
    <tr>
      <td style="padding:12px 0;border-top:1px solid ${BORDER};border-bottom:1px solid ${BORDER};">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background:${ACCENT};border-radius:4px;padding:2px 8px;">
              <span style="font-size:11px;font-weight:700;color:#fff;font-family:Arial,sans-serif;text-transform:uppercase;">Hoje</span>
            </td>
            <td style="padding-left:12px;">
              <span style="font-size:12px;color:${TEXT_LIGHT};font-family:Arial,sans-serif;">${date} · Publicado às 07:00 · ${articles.length} artigos</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Articles -->
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${rows}
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:28px 0;border-top:1px solid ${BORDER};">
        <p style="margin:0;font-size:11px;color:${TEXT_LIGHT};font-family:Arial,sans-serif;text-align:center;">
          Daily AI Digest · Enviado automaticamente todos os dias às 07:00
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function buildEmailText(articles: Article[]): string {
  return [
    'DAILY AI DIGEST',
    '─'.repeat(40),
    '',
    ...articles.map((a, i) =>
      `${i + 1}. [${a.source}] ${a.title}\n   ${a.summary ?? ''}\n   ${a.url}`
    ),
    '',
    '─'.repeat(40),
    'Daily AI Digest · dailyaidigest.com',
  ].join('\n');
}
