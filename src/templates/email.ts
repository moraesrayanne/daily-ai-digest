import { Article } from '../types';

// Source badge styles
const SOURCE_STYLE: Record<string, { bg: string; color: string; label: string; href: string }> = {
  DevTo:       { bg: '#2A7A3A18', color: '#2A7A3A', label: 'DEV.TO',       href: 'https://dev.to' },
  HackerNews:  { bg: '#C04A0018', color: '#C04A00', label: 'HACKER NEWS',  href: 'https://news.ycombinator.com' },
  ArXiv:       { bg: '#4A55D018', color: '#4A55D0', label: 'ARXIV',        href: 'https://arxiv.org' },
};

function sourceBadge(source: string): string {
  const s = SOURCE_STYLE[source] ?? { bg: '#88888818', color: '#555', label: source.toUpperCase(), href: '#' };
  return `<a href="${s.href}" style="display:inline-block;padding:2px 9px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;background:${s.bg};color:${s.color};font-family:system-ui,sans-serif;text-decoration:none;">${s.label}</a>`;
}

// Number badge: 1=solid orange, 2=light orange, 3=pale with orange text, 4+=grey
function numberBadge(index: number): string {
  const n = index + 1;
  let bg: string, color: string;
  if (n === 1)      { bg = '#D97757'; color = '#fff'; }
  else if (n === 2) { bg = '#E8A882'; color = '#fff'; }
  else if (n === 3) { bg = '#F5DDD0'; color = '#D97757'; }
  else              { bg = '#EDE9E4'; color = '#9C9189'; }

  return `<table cellpadding="0" cellspacing="0" border="0" style="width:40px;height:40px;"><tr><td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;border-radius:10px;background:${bg};font-family:Georgia,serif;font-size:18px;color:${color};font-weight:400;text-align:center;vertical-align:middle;">${n}</td></tr></table>`;
}

function articleCard(article: Article, index: number): string {
  const summary = article.summary && article.summary !== article.title
    ? `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:13px;line-height:1.7;color:#6B6459;margin-bottom:12px;">${article.summary}</div>`
    : `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:13px;line-height:1.7;color:#6B6459;margin-bottom:12px;">Resumo indisponível no momento. Clique para ler o artigo completo.</div>`;

  return `
      <tr>
        <td style="padding: 0 0 2px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td style="padding: 20px 32px; background: #FFFEFB; border-radius: 14px; border: 1px solid #E8E4DE;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="44" valign="top" style="padding-right: 16px;">
                      ${numberBadge(index)}
                    </td>
                    <td valign="top">
                      <div style="margin-bottom:6px;">${sourceBadge(article.source)}</div>
                      <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.4;color:#1C1917;margin-bottom:8px;letter-spacing:-0.01em;">${article.translatedTitle ?? article.title}</div>
                      ${summary}
                      <a href="${article.url}" style="display:inline-block;padding:6px 14px;background:#FEF1EC;border:1px solid #F5C9B3;border-radius:7px;font-family:system-ui,sans-serif;font-size:12px;font-weight:600;color:#D97757;text-decoration:none;letter-spacing:0.01em;">Ler artigo →</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>`;
}

function formatDatePt(date: Date): string {
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

export function buildEmailHtml(articles: Article[], date: string): string {
  const now = new Date();
  const dateLong = formatDatePt(now);
  const cards = articles.map((a, i) => articleCard(a, i)).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Daily AI Digest — ${dateLong}</title>
</head>
<body style="margin:0;padding:0;background-color:#F9F8F5;font-family:system-ui,-apple-system,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9F8F5;min-height:100vh;">
  <tr>
    <td align="center" style="padding: 40px 16px 60px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="32" style="padding-right:10px;">
                        <div style="width:32px;height:32px;border-radius:9px;background:#D97757;display:inline-block;text-align:center;line-height:32px;font-size:16px;">★</div>
                      </td>
                      <td>
                        <span style="font-family:Georgia,serif;font-size:19px;color:#1C1917;letter-spacing:-0.01em;">Daily <em>AI</em> Digest</span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td align="right">
                  <span style="font-size:12px;color:#9C9189;font-weight:500;">${dateLong}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO BAND -->
        <tr>
          <td style="padding-bottom: 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background: linear-gradient(135deg, #1C1917 0%, #2C2420 100%); border-radius: 18px; padding: 36px 36px 32px;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#D97757;margin-bottom:12px;">Edição de ${dateLong}</div>
                  <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;color:#F0EDE8;letter-spacing:-0.02em;margin-bottom:14px;">Os ${articles.length} artigos mais<br/>relevantes em IA hoje.</div>
                  <div style="font-size:13px;color:#B0A898;line-height:1.6;">Selecionados e resumidos automaticamente às 07:00, todos os dias.</div>
                  <div style="margin-top:20px;display:inline-block;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#D97757;border-radius:8px;padding:9px 20px;">
                          <a href="#" style="font-size:13px;font-weight:600;color:white;text-decoration:none;letter-spacing:0.01em;">Ver no site →</a>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- SECTION LABEL -->
        <tr>
          <td style="padding-bottom: 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-top: 1px solid #E8E4DE; padding-top: 20px;">
                  <span style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9C9189;">Top ${articles.length} — Por Relevância</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ARTICLES -->
        <tr>
          <td>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              ${cards}
            </table>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="height: 36px; border-top: 1px solid #E8E4DE; padding-top: 36px; margin-top: 24px;"></td></tr>

        <!-- FOOTER -->
        <tr>
          <td>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding-top: 12px;">
                  <div style="font-family:Georgia,serif;font-size:16px;color:#1C1917;margin-bottom:6px;">Daily <em>AI</em> Digest</div>
                  <div style="font-size:12px;color:#9C9189;line-height:1.8;margin-bottom:16px;">Curadoria automática de inteligência artificial · Todo dia às 07:00</div>
                  <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                    <tr>
                      <td style="padding: 0 8px;"><a href="#" style="font-size:11px;color:#9C9189;text-decoration:none;font-weight:500;">Ver no site</a></td>
                      <td style="color:#D4CFC8;font-size:12px;">·</td>
                      <td style="padding: 0 8px;"><a href="#" style="font-size:11px;color:#9C9189;text-decoration:none;font-weight:500;">Edições anteriores</a></td>
                      <td style="color:#D4CFC8;font-size:12px;">·</td>
                      <td style="padding: 0 8px;"><a href="#" style="font-size:11px;color:#9C9189;text-decoration:none;font-weight:500;">Cancelar inscrição</a></td>
                    </tr>
                  </table>
                  <div style="font-size:10px;color:#C4BFBA;margin-top:16px;">© ${now.getFullYear()} Daily AI Digest · Curadoria automática de IA</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
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
      `${i + 1}. [${a.source}] ${a.translatedTitle ?? a.title}\n   ${a.summary ?? ''}\n   ${a.url}`
    ),
    '',
    '─'.repeat(40),
    'Daily AI Digest · Curadoria automática de IA',
  ].join('\n');
}
