import { User } from '@/modules/users/entities/user.entity';
import { OmitType } from '@nestjs/mapped-types';

export class ResponseUserDto extends OmitType(User, ['password'] as const) {}
