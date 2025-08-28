import { ResponseAccountDto } from '../dto/response-account.dto';
import { IAccount } from '../interfaces/account.interface';

export const toAccountResponse = (account: IAccount): ResponseAccountDto => {
  return {
    id: account.id,
    userId: account.userId,
    email: account.email,
    providerId: account.providerId,
    provider: account.provider,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
};
