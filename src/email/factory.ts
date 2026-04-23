import { EmailProvider } from './types';
import { SendGridProvider } from './providers/sendgrid';
import emailConfig from '../../config/email.json';

let instance: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (instance) return instance;

  const active = emailConfig.active;

  if (active === 'sendgrid') { instance = new SendGridProvider(); return instance; }

  throw new Error(`[email/factory] Unknown email provider: "${active}". Check config/email.json.`);
}

export function _resetProviderForTest(): void {
  instance = null;
}
