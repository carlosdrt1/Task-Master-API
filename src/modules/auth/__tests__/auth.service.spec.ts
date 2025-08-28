import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '@/shared/hasher/hasher.service';
import {
  userDBfactory,
  registerAppInputFactory,
  loginUserInputFactory,
} from '@test/factories/users.factory';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from '@/modules/accounts/accounts.service';
import { Provider } from '@/shared/types/provider.type';
import { ResponseAccountDto } from '@/modules/accounts/dto/response-account.dto';
import { accountDbFactory } from '@test/factories/accounts.factory';
import { CreateAppAccountDto } from '@/modules/accounts/dto/create-app-account.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let hashService: jest.Mocked<HashService>;
  let accountsService: jest.Mocked<AccountsService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            create: jest.fn().mockImplementation((dto: CreateUserDto) => {
              const userDb = userDBfactory(dto);
              return Promise.resolve(userDb);
            }),
          };
        }
        if (token === JwtService) {
          return { signAsync: jest.fn().mockResolvedValue('signed-jwt') };
        }
        if (token === HashService) {
          return {
            hash: jest
              .fn()
              .mockImplementation((password: string) => `hashed-${password}`),
            verify: jest.fn(),
          };
        }
        if (token === AccountsService) {
          return {
            findByEmail: jest.fn(),
            createByApp: jest
              .fn()
              .mockImplementation((dto: CreateAppAccountDto) =>
                accountDbFactory(dto),
              ),
          };
        }
      })
      .compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    hashService = moduleRef.get(HashService);
    accountsService = moduleRef.get(AccountsService);
  });

  test('Should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    test('Should register an user and create an APP account successfully', async () => {
      accountsService.findByEmail.mockResolvedValue(null);
      const user = registerAppInputFactory();

      const result = await authService.registerApp(user);

      expect(accountsService.findByEmail).toHaveBeenCalledWith(user.email);
      expect(hashService.hash).toHaveBeenCalledWith(user.password);
      expect(usersService.create).toHaveBeenCalledWith({
        name: user.name,
      });
      expect(accountsService.createByApp).toHaveBeenCalledWith({
        userId: expect.any(String) as string,
        email: user.email,
        password: `hashed-${user.password}`,
        provider: 'APP',
      });
      expect(result).toStrictEqual({
        id: expect.any(String) as string,
        name: user.name,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
        accounts: [
          expect.objectContaining({
            userId: expect.any(String) as string,
            email: user.email,
            providerId: null,
            provider: 'APP' as Provider,
            createdAt: expect.any(Date) as Date,
            updatedAt: expect.any(Date) as Date,
          }) as ResponseAccountDto,
        ],
      });
    });

    test('Should fail if the email passed is already registered', async () => {
      const user = registerAppInputFactory();
      accountsService.findByEmail.mockResolvedValue(
        accountDbFactory({ email: user.email, provider: 'APP' }),
      );

      await expect(authService.registerApp(user)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    test('Should log in a user successfully', async () => {
      const loginData = loginUserInputFactory();
      hashService.verify.mockResolvedValue(true);
      accountsService.findByEmail.mockResolvedValue(
        accountDbFactory({
          email: loginData.email,
          password: `hashed-${loginData.password}`,
          provider: 'APP',
        }),
      );

      const result = await authService.loginApp(loginData);

      expect(accountsService.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(hashService.verify).toHaveBeenCalledWith(
        `hashed-${loginData.password}`,
        loginData.password,
      );
      expect(result).toStrictEqual('signed-jwt');
    });

    test('Should fail if email do not exists', async () => {
      const loginData = loginUserInputFactory();
      accountsService.findByEmail.mockResolvedValue(null);

      await expect(authService.loginApp(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    test('Should fail if the user is registered with other provider', async () => {
      const loginData = loginUserInputFactory();
      accountsService.findByEmail.mockResolvedValue(
        accountDbFactory({
          email: loginData.email,
          provider: 'GOOGLE',
        }),
      );

      await expect(authService.loginApp(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    test('Should fail if the password verification fail', async () => {
      const loginData = loginUserInputFactory();
      hashService.verify.mockResolvedValue(false);
      accountsService.findByEmail.mockResolvedValue(
        accountDbFactory({
          email: loginData.email,
          password: `hashed-other-password`,
          provider: 'APP',
        }),
      );

      await expect(authService.loginApp(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
