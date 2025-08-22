import { Provider } from '@/shared/enums/provider.enum';
import { Expose } from 'class-transformer';

export class User {
  id: string;
  name: string;
  email: string;
  provider: Provider;
  createdAt: Date;
  updatedAt: Date;

  @Expose({
    groups: ['auth'],
  })
  password?: string;
}
