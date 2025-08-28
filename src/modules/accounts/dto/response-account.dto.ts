import { Provider } from '@/shared/types/provider.type';

export interface ResponseAccountDto {
  id: string;
  userId: string;
  email: string | null;
  providerId: string | null;
  provider: Provider;
  createdAt: Date;
  updatedAt: Date;
}
