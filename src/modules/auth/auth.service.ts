import { HashService } from '@/shared/hasher/hasher.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { Provider } from '@/shared/enums/provider.enum';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto): Promise<User> {
    const existUser = await this.usersService.findByEmail(dto.email);
    if (existUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.hashService.hash(dto.password);
    const user = await this.usersService.create(
      { ...dto, password: hashedPassword },
      Provider.APP,
    );

    return user;
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await this.hashService.verify(user.password!, dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id };
    return { token: await this.jwtService.signAsync(payload) };
  }
}
