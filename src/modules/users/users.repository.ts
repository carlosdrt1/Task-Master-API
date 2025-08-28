import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@/shared/interfaces/abstract.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { IUserWithAccounts } from './interfaces/user-accounts.types';

@Injectable()
export class UsersRepository
  implements AbstractRepository<IUser | IUserWithAccounts>
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<IUser> {
    return this.prismaService.user.create({
      data,
    });
  }

  async findById(id: string): Promise<IUser | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async findWithAccounts(id: string): Promise<IUserWithAccounts | null> {
    return this.prismaService.user.findUnique({
      where: { id },
      include: { accounts: true },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<IUser> {
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }
}
