import { Provider } from '@/shared/enums/provider.enum';
import { Exclude } from 'class-transformer';

export class User {
  id: string;
  name: string;
  email: string;
  provider: Provider;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password?: string;
}
