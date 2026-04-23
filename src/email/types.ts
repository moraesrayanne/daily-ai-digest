import { EmailPayload } from '../services/formatter';

export type { EmailPayload };

export interface EmailProvider {
  send(payload: EmailPayload, to: string): Promise<void>;
}
