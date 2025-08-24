import { LoginDto } from '@/modules/auth/dto/login.dto';
import { CreateUserOAuthDto } from '@/modules/users/dto/create-user-oauth.dto';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { User } from '@/modules/users/entities/user.entity';
import { Provider } from '@/shared/enums/provider.enum';
import { faker } from '@faker-js/faker';

export const userDBfactory = (override?: Partial<User>): User => {
  const provider = override?.provider || faker.helpers.enumValue(Provider);

  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    provider: provider,
    providerId: provider !== Provider.APP ? faker.string.uuid() : undefined,
    password: provider === Provider.APP ? faker.internet.password() : undefined,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  };
};

export const createUserInputFactory = (
  override?: Partial<CreateUserDto>,
): CreateUserDto => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  };
};

export const OAuthUserInputFactory = (
  override?: Partial<CreateUserOAuthDto>,
): CreateUserOAuthDto => {
  const providersOAuth = Object.values(Provider).filter((p) => {
    return p !== Provider.APP;
  });

  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    provider: faker.helpers.arrayElement(providersOAuth),
    providerId: faker.string.numeric(12),
    ...override,
  };
};

export const loginUserInputFactory = (
  override?: Partial<LoginDto>,
): LoginDto => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  };
};
