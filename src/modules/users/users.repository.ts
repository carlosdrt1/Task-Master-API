import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@/shared/interfaces/abstract.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Provider } from '@/shared/enums/provider.enum';
import { plainToInstance } from 'class-transformer';
import { CreateUserOAuthDto } from './dto/create-user-oauth.dto';

@Injectable()
export class UsersRepository implements AbstractRepository<User> {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.prismaService.user.create({
      data: {
        ...data,
        provider: Provider.APP,
      },
    });
    return plainToInstance(User, user);
  }

  async createUserOAuth(data: CreateUserOAuthDto): Promise<User> {
    const user = await this.prismaService.user.create({ data });

    return plainToInstance(User, user, {
      groups: ['auth'],
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    return plainToInstance(User, user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    return plainToInstance(User, user, {
      groups: ['auth'],
    });
  }

  async findByProviderId(providerId: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { providerId },
    });

    return plainToInstance(User, user, {
      groups: ['auth'],
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.prismaService.user.update({ where: { id }, data });
    return plainToInstance(User, user);
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }
}
