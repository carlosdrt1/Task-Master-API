import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { CreateUserOAuthDto } from './dto/create-user-oauth.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(dto);
  }

  async findOrCreateOAuthUser(dto: CreateUserOAuthDto): Promise<User> {
    const exists = await this.findByEmail(dto.email);
    if (!exists) return this.usersRepository.createUserOAuth(dto);

    if (exists.provider !== dto.provider) {
      throw new ConflictException(
        `This email is already registered with ${exists.provider}. Please log in using ${exists.provider}`,
      );
    }

    return exists;
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    return this.usersRepository.remove(id);
  }
}
