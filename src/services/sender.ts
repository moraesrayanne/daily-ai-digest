import sgMail from '@sendgrid/mail';
import { EmailPayload } from './formatter';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function send(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const to = process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM ?? 'digest@dailyaidigest.com';

  if (!apiKey) throw new Error('SENDGRID_API_KEY is not set');
  if (!to) throw new Error('EMAIL_TO is not set');

  sgMail.setApiKey(apiKey);

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await sgMail.send({ to, from, subject: payload.subject, html: payload.html, text: payload.text });
      console.log(`[sender] Email delivered to ${to}`);
      return;
    } catch (err) {
      lastError = err;
      const details = (err as any)?.response?.body?.errors;
      console.error(`[sender] Attempt ${attempt} failed:`, details ?? err);
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
    }
  }

  console.error('[sender] All delivery attempts failed');
  throw lastError;
}
