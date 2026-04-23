import { SendGridProvider } from './sendgrid';
import { EmailPayload } from '../../services/formatter';

const mockSend = jest.fn();

jest.mock('@sendgrid/mail', () => ({
  __esModule: true,
  default: { setApiKey: jest.fn(), send: (...args: unknown[]) => mockSend(...args) },
}));

jest.mock('../../lib/retry', () => ({
  withRetry: jest.fn().mockImplementation(async (fn: () => Promise<unknown>) => fn()),
}));

const payload: EmailPayload = {
  subject: '🤖 Daily AI Digest — 01/01/2024',
  html: '<p>test</p>',
  text: 'test',
};

describe('SendGridProvider', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, SENDGRID_API_KEY: 'sg-key' };
    mockSend.mockReset();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('sends email and resolves on success', async () => {
    mockSend.mockResolvedValueOnce({});
    const provider = new SendGridProvider();
    await expect(provider.send(payload, 'user@example.com')).resolves.toBeUndefined();
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('passes the `to` argument to sgMail', async () => {
    mockSend.mockResolvedValueOnce({});
    const provider = new SendGridProvider();
    await provider.send(payload, 'dest@example.com');
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ to: 'dest@example.com' }));
  });

  it('uses EMAIL_FROM env when set', async () => {
    process.env.EMAIL_FROM = 'custom@example.com';
    mockSend.mockResolvedValueOnce({});
    const provider = new SendGridProvider();
    await provider.send(payload, 'user@example.com');
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ from: 'custom@example.com' }));
  });

  it('defaults from to digest@dailyaidigest.com', async () => {
    delete process.env.EMAIL_FROM;
    mockSend.mockResolvedValueOnce({});
    const provider = new SendGridProvider();
    await provider.send(payload, 'user@example.com');
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ from: 'digest@dailyaidigest.com' }));
  });

  it('throws when SENDGRID_API_KEY is missing', async () => {
    delete process.env.SENDGRID_API_KEY;
    const provider = new SendGridProvider();
    await expect(provider.send(payload, 'user@example.com')).rejects.toThrow('SENDGRID_API_KEY');
  });
});
