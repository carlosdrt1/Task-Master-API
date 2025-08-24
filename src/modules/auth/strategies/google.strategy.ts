import { CreateUserOAuthDto } from '@/modules/users/dto/create-user-oauth.dto';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { Provider } from '@/shared/enums/provider.enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, StrategyOptions } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    const dto: CreateUserOAuthDto = {
      name: profile.displayName,
      email: profile.emails![0].value,
      provider: Provider.GOOGLE,
      providerId: profile.id,
    };
    const user = await this.usersService.findOrCreateOAuthUser(dto);

    return user;
  }
}
