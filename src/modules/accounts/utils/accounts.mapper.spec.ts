import { accountDbFactory } from '@test/factories/accounts.factory';
import { toAccountResponse } from './accounts.mapper';

describe('AccountsMapper', () => {
  test('Should transform account entity in account response DTO', () => {
    const account = accountDbFactory();

    const result = toAccountResponse(account);

    expect(result).toStrictEqual({
      id: account.id,
      userId: account.userId,
      email: account.email,
      providerId: account.providerId,
      provider: account.provider,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  });
});
