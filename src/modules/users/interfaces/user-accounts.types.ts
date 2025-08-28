import { IAccount } from '@/modules/accounts/interfaces/account.interface';
import { IUser } from './user.interface';

export interface IUserWithAccounts extends Omit<IUser, 'accounts'> {
  accounts: IAccount[];
}
