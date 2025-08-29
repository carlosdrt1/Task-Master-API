import { Provider } from '@/shared/types/provider.type';

export interface CreateAppAccountDto {
  userId: string;
  email: string;
  password: string;
  provider: Provider;
}
