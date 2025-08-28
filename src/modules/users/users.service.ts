import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<IUser> {
    return this.usersRepository.create(dto);
  }

  async findOne(id: string): Promise<IUser | null> {
    return this.usersRepository.findById(id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<IUser> {
    return this.usersRepository.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    return this.usersRepository.remove(id);
  }
}
