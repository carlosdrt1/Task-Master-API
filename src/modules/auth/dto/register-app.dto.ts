import { IsEmail, MinLength } from 'class-validator';

export class RegisterAppDto {
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
