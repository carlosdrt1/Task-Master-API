import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-app.dto';
import { Request, Response } from 'express';
import { authCookieConfig } from '@/config/auth-cookies.config';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { RegisterAppDto } from './dto/register-app.dto';
import { IUser } from '../users/interfaces/user.interface';
import { IAccount } from '../accounts/interfaces/account.interface';

interface RequestUser extends Request {
  user: IAccount;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterAppDto): Promise<IUser> {
    return this.authService.registerApp(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() body: LoginDto,
  ): Promise<{ message: string }> {
    const token = await this.authService.loginApp(body);
    response.cookie('token', token, authCookieConfig);

    return { message: 'User logged in successfully' };
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  googleLogin(): void {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleRedirect(
    @Req() request: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const account = request.user;

    const token = await this.authService.generateToken({
      userId: account.userId,
    });
    response.cookie('token', token, authCookieConfig);

    return { message: 'User logged in successfully' };
  }
}
