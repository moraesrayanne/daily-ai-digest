import { send } from './sender';
import { getEmailProvider, _resetProviderForTest } from '../email/factory';
import { EmailPayload } from './formatter';

jest.mock('../email/factory');

const mockProviderSend = jest.fn();

const payload: EmailPayload = {
  subject: '🤖 Daily AI Digest — 01/01/2024',
  html: '<p>test</p>',
  text: 'test',
};

beforeEach(() => {
  (getEmailProvider as jest.Mock).mockReturnValue({ send: mockProviderSend });
  mockProviderSend.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.clearAllMocks();
  _resetProviderForTest();
  delete process.env.EMAIL_TO;
});

describe('send', () => {
  it('throws when EMAIL_TO is not set', async () => {
    delete process.env.EMAIL_TO;
    await expect(send(payload)).rejects.toThrow('EMAIL_TO is not set');
  });

  it('sends to a single recipient', async () => {
    process.env.EMAIL_TO = 'user@example.com';
    await send(payload);
    expect(mockProviderSend).toHaveBeenCalledTimes(1);
    expect(mockProviderSend).toHaveBeenCalledWith(payload, 'user@example.com');
  });

  it('sends to multiple recipients in parallel', async () => {
    process.env.EMAIL_TO = 'a@example.com, b@example.com, c@example.com';
    await send(payload);
    expect(mockProviderSend).toHaveBeenCalledTimes(3);
    expect(mockProviderSend).toHaveBeenCalledWith(payload, 'a@example.com');
    expect(mockProviderSend).toHaveBeenCalledWith(payload, 'b@example.com');
    expect(mockProviderSend).toHaveBeenCalledWith(payload, 'c@example.com');
  });

  it('trims whitespace from recipient emails', async () => {
    process.env.EMAIL_TO = '  me@example.com  ,  you@example.com  ';
    await send(payload);
    expect(mockProviderSend).toHaveBeenCalledWith(payload, 'me@example.com');
    expect(mockProviderSend).toHaveBeenCalledWith(payload, 'you@example.com');
  });

  it('ignores empty entries in EMAIL_TO', async () => {
    process.env.EMAIL_TO = 'a@example.com,,b@example.com';
    await send(payload);
    expect(mockProviderSend).toHaveBeenCalledTimes(2);
  });

  it('delegates to the active email provider', async () => {
    process.env.EMAIL_TO = 'user@example.com';
    await send(payload);
    expect(getEmailProvider).toHaveBeenCalled();
  });
});
