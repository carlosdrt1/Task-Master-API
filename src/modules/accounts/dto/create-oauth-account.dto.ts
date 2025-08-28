import { Provider } from '@/shared/types/provider.type';

export class CreateOAuthAccountDto {
  userId: string;
  email?: string;
  providerId?: string;
  provider: Provider;
}
