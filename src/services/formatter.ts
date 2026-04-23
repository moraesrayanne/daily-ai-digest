import { Article } from '../types';
import { buildEmailHtml, buildEmailText } from '../templates/email';

export interface EmailPayload {
  subject: string;
  html: string;
  text: string;
}

export function format(articles: Article[], now: Date = new Date()): EmailPayload {
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const date = `${day}/${month}/${year}`;

  return {
    subject: `🤖 Daily AI Digest — ${date}`,
    html: buildEmailHtml(articles, date),
    text: buildEmailText(articles),
  };
}
