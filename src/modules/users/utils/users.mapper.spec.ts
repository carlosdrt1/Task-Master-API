import { userWithAccountsDBFactory } from '@test/factories/users.factory';
import { toUserResponseWithAccounts } from './users.mapper';
import { accountDbFactory } from '@test/factories/accounts.factory';
import { toAccountResponse } from '@/modules/accounts/utils/accounts.mapper';

describe('UserMapper', () => {
  test('Should transform user entity in user response DTO', () => {
    const userWithAccounts = userWithAccountsDBFactory({
      accounts: [accountDbFactory({ provider: 'APP' })],
    });

    const result = toUserResponseWithAccounts(userWithAccounts);

    expect(result.accounts).not.toHaveProperty('password');
    expect(result).toStrictEqual({
      id: userWithAccounts.id,
      name: userWithAccounts.name,
      accounts: userWithAccounts.accounts.map(toAccountResponse),
      createdAt: userWithAccounts.createdAt,
      updatedAt: userWithAccounts.updatedAt,
    });
  });
});
