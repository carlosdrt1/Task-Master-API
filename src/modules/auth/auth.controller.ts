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
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { authCookieConfig } from '@/config/auth-cookies.config';
import { User } from '../users/entities/user.entity';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<User> {
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
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const user = request.user as User;
    const token = await this.authService.generateToken({
      userId: user.id,
      userEmail: user.email,
    });
    response.cookie('token', token, authCookieConfig);

    return { message: 'User logged in successfully' };
  }
}
