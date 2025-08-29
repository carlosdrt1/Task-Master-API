import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { CreateAppAccountDto } from './dto/create-app-account.dto';
import { CreateOAuthAccountDto } from './dto/create-oauth-account.dto';
import { Provider } from '@/shared/types/provider.type';
import { IAccount } from './interfaces/account.interface';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async createByApp(dto: CreateAppAccountDto): Promise<IAccount> {
    return this.accountsRepository.create({ ...dto, provider: 'APP' });
  }

  async createByOAuth(dto: CreateOAuthAccountDto): Promise<IAccount> {
    return this.accountsRepository.create(dto);
  }

  async findByProviderId(
    providerId: string,
    provider: Provider,
  ): Promise<IAccount | null> {
    return this.accountsRepository.findByProviderId(providerId, provider);
  }

  async findByEmail(email: string): Promise<IAccount | null> {
    return this.accountsRepository.findByEmail(email);
  }
}
