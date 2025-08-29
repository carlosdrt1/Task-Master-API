import { HashService } from '@/shared/hasher/hash.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-app.dto';
import { RegisterAppDto } from './dto/register-app.dto';
import { AccountsService } from '../accounts/accounts.service';
import { Profile } from 'passport';
import { Provider } from '@/shared/types/provider.type';
import { toAccountResponse } from '../accounts/utils/accounts.mapper';
import { ResponseUserWithAccountsDto } from '../users/dto/response-user-accounts.dto';
import { IAccount } from '../accounts/interfaces/account.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  async registerApp(dto: RegisterAppDto): Promise<ResponseUserWithAccountsDto> {
    const existAccount = await this.accountsService.findByEmail(dto.email);
    if (existAccount) {
      throw new ConflictException('This email is already registered');
    }

    const user = await this.usersService.create({ name: dto.name });

    const hashedPassword = await this.hashService.hash(dto.password);
    const account = await this.accountsService.createByApp({
      userId: user.id,
      email: dto.email,
      password: hashedPassword,
      provider: 'APP',
    });

    return {
      ...user,
      accounts: [toAccountResponse(account)],
    };
  }

  async registerOAuth(profile: Profile, provider: Provider): Promise<IAccount> {
    const exist = await this.accountsService.findByProviderId(
      profile.id,
      provider,
    );

    if (exist) return exist;

    const user = await this.usersService.create({ name: profile.displayName });
    return this.accountsService.createByOAuth({
      userId: user.id,
      providerId: profile.id,
      provider,
      email: profile.emails ? profile.emails[0].value : undefined,
    });
  }

  async loginApp(dto: LoginDto): Promise<string> {
    const account = await this.accountsService.findByEmail(dto.email);
    if (!account || account.provider !== 'APP') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await this.hashService.verify(
      account.password!,
      dto.password,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: account.userId };
    return this.generateToken(payload);
  }

  async generateToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
