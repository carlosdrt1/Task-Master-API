import { HashService } from '@/shared/hasher/hasher.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { Provider } from '@/shared/enums/provider.enum';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: CreateUserDto): Promise<ResponseUserDto> {
    const hashedPassword = await this.hashService.hash(dto.password);
    const user = await this.usersService.create(
      { ...dto, password: hashedPassword },
      Provider.APP,
    );

    return plainToInstance(ResponseUserDto, user);
  }
}
