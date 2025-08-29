import { IAccount } from '@/modules/accounts/interfaces/account.interface';
import { Provider } from '@/shared/types/provider.type';
import { faker } from '@faker-js/faker/.';

export const accountDbFactory = (override?: Partial<IAccount>): IAccount => {
  const provider: Provider =
    override?.provider ?? (faker.number.int(1) === 1 ? 'APP' : 'GOOGLE');

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    email: provider === 'APP' ? faker.internet.email() : null,
    provider,
    providerId: provider !== 'APP' ? faker.string.numeric(12) : null,
    password: provider === 'APP' ? faker.internet.password() : null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  };
};
