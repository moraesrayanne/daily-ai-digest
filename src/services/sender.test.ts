import { send } from './sender';
import { EmailPayload } from './formatter';

const mockSend = jest.fn();

jest.mock('@sendgrid/mail', () => ({
  __esModule: true,
  default: { setApiKey: jest.fn(), send: (...args: unknown[]) => mockSend(...args) },
}));

jest.mock('./sender', () => {
  const actual = jest.requireActual('./sender');
  return { ...actual, sleep: jest.fn().mockResolvedValue(undefined) };
});

const payload: EmailPayload = {
  subject: '🤖 Daily AI Digest — 01/01/2024',
  html: '<p>test</p>',
  text: 'test',
};

describe('send', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, SENDGRID_API_KEY: 'sg-key', EMAIL_TO: 'user@example.com' };
    mockSend.mockReset();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('sends email and resolves on success', async () => {
    mockSend.mockResolvedValueOnce({});
    await expect(send(payload)).resolves.toBeUndefined();
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('uses EMAIL_FROM env when set', async () => {
    process.env.EMAIL_FROM = 'custom@example.com';
    mockSend.mockResolvedValueOnce({});
    await send(payload);
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ from: 'custom@example.com' }));
  });

  it('defaults from to digest@dailyaidigest.com', async () => {
    delete process.env.EMAIL_FROM;
    mockSend.mockResolvedValueOnce({});
    await send(payload);
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ from: 'digest@dailyaidigest.com' }));
  });

  it('throws immediately when SENDGRID_API_KEY missing', async () => {
    delete process.env.SENDGRID_API_KEY;
    await expect(send(payload)).rejects.toThrow('SENDGRID_API_KEY');
  });

  it('throws immediately when EMAIL_TO missing', async () => {
    delete process.env.EMAIL_TO;
    await expect(send(payload)).rejects.toThrow('EMAIL_TO');
  });

  it('retries up to 3 times then throws', async () => {
    mockSend.mockRejectedValue(new Error('network error'));
    await expect(send(payload)).rejects.toThrow('network error');
    expect(mockSend).toHaveBeenCalledTimes(3);
  });

  it('succeeds on second attempt after first failure', async () => {
    mockSend.mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce({});
    await expect(send(payload)).resolves.toBeUndefined();
    expect(mockSend).toHaveBeenCalledTimes(2);
  });
});
