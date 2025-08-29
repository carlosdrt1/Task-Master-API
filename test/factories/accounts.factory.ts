import { IAccount } from '@/modules/accounts/interfaces/account.interface';
import { Provider } from '@/shared/types/provider.type';
import { faker } from '@faker-js/faker/.';
import { Profile } from 'passport';

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

export const profileFactory = (override?: Partial<Profile>): Profile => {
  return {
    id: faker.string.numeric(12),
    displayName: faker.internet.displayName(),
    provider: 'google',
    emails: [{ value: faker.internet.email() }],
    ...override,
  };
};
