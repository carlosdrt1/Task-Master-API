import { Provider } from '@/shared/types/provider.type';

export interface IAccount {
  id: string;
  userId: string;
  email: string | null;
  providerId: string | null;
  provider: Provider;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}
