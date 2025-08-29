import { ResponseAccountDto } from '@/modules/accounts/dto/response-account.dto';
import { IUser } from '../interfaces/user.interface';

export interface ResponseUserWithAccountsDto extends Omit<IUser, 'accounts'> {
  accounts: ResponseAccountDto[];
}
