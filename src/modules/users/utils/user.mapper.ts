import { toAccountResponse } from '@/modules/accounts/utils/accounts.mapper';
import { ResponseUserWithAccountsDto } from '../dto/response-user-accounts.dto';
import { IUserWithAccounts } from '../interfaces/user-accounts.types';

export const toUserResponseWithAccounts = (
  userWithAccounts: IUserWithAccounts,
): ResponseUserWithAccountsDto => {
  return {
    id: userWithAccounts.id,
    name: userWithAccounts.name,
    accounts: userWithAccounts.accounts.map((acc) => toAccountResponse(acc)),
    createdAt: userWithAccounts.createdAt,
    updatedAt: userWithAccounts.updatedAt,
  };
};
