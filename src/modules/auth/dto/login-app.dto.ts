import { OmitType } from '@nestjs/mapped-types';
import { RegisterAppDto } from './register-app.dto';

export class LoginDto extends OmitType(RegisterAppDto, ['name'] as const) {}
