import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { OmitType } from '@nestjs/mapped-types';

export class LoginDto extends OmitType(CreateUserDto, ['name'] as const) {}
