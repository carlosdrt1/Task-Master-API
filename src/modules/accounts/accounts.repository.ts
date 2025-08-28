import { PrismaService } from '@/database/prisma/prisma.service';
import { AbstractRepository } from '@/shared/interfaces/abstract.repository';
import { Injectable } from '@nestjs/common';
import { CreateAppAccountDto } from './dto/create-app-account.dto';
import { Provider } from '@/shared/types/provider.type';
import { CreateOAuthAccountDto } from './dto/create-oauth-account.dto';
import { IAccount } from './interfaces/account.interface';

@Injectable()
export class AccountsRepository implements AbstractRepository<IAccount> {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: CreateAppAccountDto | CreateOAuthAccountDto,
  ): Promise<IAccount> {
    return this.prismaService.account.create({ data });
  }

  async findById(id: string): Promise<IAccount | null> {
    return this.prismaService.account.findUnique({ where: { id } });
  }

  async findByProviderId(
    providerId: string,
    provider: Provider,
  ): Promise<IAccount | null> {
    return this.prismaService.account.findUnique({
      where: { providerId_provider: { provider, providerId } },
    });
  }

  async findByEmail(email: string): Promise<IAccount | null> {
    return this.prismaService.account.findFirst({
      where: { email, provider: 'APP' },
    });
  }

  async update(id: string, data: Partial<IAccount>): Promise<IAccount> {
    return this.prismaService.account.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.account.delete({ where: { id } });
  }
}
