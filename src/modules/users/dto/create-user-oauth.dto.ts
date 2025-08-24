import { Provider } from '@/shared/enums/provider.enum';

export class CreateUserOAuthDto {
  name: string;
  email: string;
  providerId: string;
  provider: Provider;
}
