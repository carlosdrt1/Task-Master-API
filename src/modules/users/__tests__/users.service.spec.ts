import { Test } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import { CreateUserOAuthDto } from '../dto/create-user-oauth.dto';
import {
  OAuthUserInputFactory,
  userDBfactory,
} from '@test/factories/user.factory';
import { Provider } from '@/shared/enums/provider.enum';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker((token) => {
        if (token === UsersRepository) {
          return {
            findByEmail: jest.fn(),
            findByProviderId: jest.fn(),
            createUserOAuth: jest
              .fn()
              .mockImplementation((dto: CreateUserOAuthDto) => {
                const userDb = userDBfactory(dto);
                return Promise.resolve(userDb);
              }),
          };
        }
      })
      .compile();

    usersService = moduleRef.get(UsersService);
    usersRepository = moduleRef.get(UsersRepository);
  });

  test('Should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('Find or create OAuth user', () => {
    test('Should create a OAuth user succesfully', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      const user = OAuthUserInputFactory();

      const result = await usersService.findOrCreateOAuthUser(user);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(user.email);
      expect(usersRepository.createUserOAuth).toHaveBeenCalledWith(user);
      expect(result).toStrictEqual({
        id: expect.any(String) as string,
        name: user.name,
        email: user.email,
        provider: Provider.GOOGLE,
        providerId: expect.any(String) as string,
        password: undefined,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });

    test('Should return an user if he alredy exist with the same provider', async () => {
      const user = OAuthUserInputFactory();
      usersRepository.findByEmail.mockResolvedValue(userDBfactory(user));

      const result = await usersService.findOrCreateOAuthUser(user);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(user.email);
      expect(result).toStrictEqual({
        id: expect.any(String) as string,
        name: user.name,
        email: user.email,
        provider: Provider.GOOGLE,
        providerId: expect.any(String) as string,
        password: undefined,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });

    test('Should fail if the user exists but the provider is different', async () => {
      const user = OAuthUserInputFactory();
      usersRepository.findByEmail.mockResolvedValue(
        userDBfactory({ ...user, provider: Provider.APP }),
      );

      await expect(usersService.findOrCreateOAuthUser(user)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
