import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '@/shared/hasher/hasher.service';
import {
  userDBfactory,
  createUserInputFactory,
  loginUserInputFactory,
} from '@test/factories/user.factory';
import { Provider } from '@/shared/enums/provider.enum';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            findByEmail: jest.fn(),
            create: jest.fn().mockImplementation((dto: CreateUserDto) => {
              const userDb = userDBfactory({ ...dto, provider: Provider.APP });
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
      })
      .compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    hashService = moduleRef.get(HashService);
  });

  test('Should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    test('Should register an user successfully', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      const user = createUserInputFactory();

      const result = await authService.registerApp(user);

      expect(usersService.findByEmail).toHaveBeenCalledWith(user.email);
      expect(hashService.hash).toHaveBeenCalledWith(user.password);
      expect(usersService.create).toHaveBeenCalledWith({
        ...user,
        password: `hashed-${user.password}`,
      });
      expect(result).toStrictEqual({
        id: expect.any(String) as string,
        name: user.name,
        email: user.email,
        provider: Provider.APP,
        providerId: undefined,
        password: `hashed-${user.password}`,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
    });

    test('Should fail if the email passed is already registered', async () => {
      const user = createUserInputFactory();
      usersService.findByEmail.mockResolvedValue(
        userDBfactory({ email: user.email, provider: Provider.APP }),
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
      usersService.findByEmail.mockResolvedValue(
        userDBfactory({
          email: loginData.email,
          password: `hashed-${loginData.password}`,
          provider: Provider.APP,
        }),
      );

      const result = await authService.loginApp(loginData);

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(hashService.verify).toHaveBeenCalledWith(
        `hashed-${loginData.password}`,
        loginData.password,
      );
      expect(result).toStrictEqual({
        token: 'signed-jwt',
      });
    });

    test('Should fail if email do not exists', async () => {
      const loginData = loginUserInputFactory();
      usersService.findByEmail.mockResolvedValue(null);

      await expect(authService.loginApp(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    test('Should fail if the user is registered with other provider', async () => {
      const loginData = loginUserInputFactory();
      usersService.findByEmail.mockResolvedValue(
        userDBfactory(
          userDBfactory({
            email: loginData.email,
            password: `hashed-${loginData.password}`,
            provider: Provider.GOOGLE,
          }),
        ),
      );

      await expect(authService.loginApp(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    test('Should fail if the password verification fail', async () => {
      const loginData = loginUserInputFactory();
      hashService.verify.mockResolvedValue(false);
      usersService.findByEmail.mockResolvedValue(
        userDBfactory({
          email: loginData.email,
          password: `hashed-${loginData.password}`,
          provider: Provider.APP,
        }),
      );

      await expect(authService.loginApp(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
