import sgMail from '@sendgrid/mail';
import { EmailProvider, EmailPayload } from '../types';
import { withRetry } from '../../lib/retry';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export class SendGridProvider implements EmailProvider {
  async send(payload: EmailPayload, to: string): Promise<void> {
    const apiKey = process.env.SENDGRID_API_KEY;
    const from = process.env.EMAIL_FROM ?? 'digest@dailyaidigest.com';

    if (!apiKey) throw new Error('SENDGRID_API_KEY is not set');

    sgMail.setApiKey(apiKey);

    await withRetry(
      () => sgMail.send({ to, from, subject: payload.subject, html: payload.html, text: payload.text }),
      {
        maxAttempts: MAX_RETRIES,
        delayMs: RETRY_DELAY_MS,
        onRetry: (err, attempt) => {
          const details = (err as any)?.response?.body?.errors;
          console.error(`[sender] Attempt ${attempt} failed:`, details ?? err);
        },
      }
    );

    console.log(`[sender] Email delivered to ${to}`);
  }
}
