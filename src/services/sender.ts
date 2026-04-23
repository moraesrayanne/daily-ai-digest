import { EmailPayload } from './formatter';
import { getEmailProvider } from '../email/factory';

function getRecipients(): string[] {
  const raw = process.env.EMAIL_TO ?? '';
  return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
}

export async function send(payload: EmailPayload): Promise<void> {
  const recipients = getRecipients();
  if (recipients.length === 0) throw new Error('EMAIL_TO is not set');

  const provider = getEmailProvider();
  await Promise.all(recipients.map((email) => provider.send(payload, email)));
}
