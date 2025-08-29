import { LoginDto } from '@/modules/auth/dto/login-app.dto';
import { RegisterAppDto } from '@/modules/auth/dto/register-app.dto';
import { IUser } from '@/modules/users/interfaces/user.interface';
import { faker } from '@faker-js/faker';

export const userDBfactory = (override?: Partial<IUser>): IUser => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  };
};

export const registerAppInputFactory = (
  override?: Partial<RegisterAppDto>,
): RegisterAppDto => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
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
