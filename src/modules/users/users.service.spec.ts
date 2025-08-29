import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker((token) => {
        if (token === UsersRepository) {
          return {
            findByEmail: jest.fn(),
            findByProviderId: jest.fn(),
            createUserOAuth: jest.fn(),
          };
        }
      })
      .compile();

    usersService = moduleRef.get(UsersService);
  });

  test('Should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
