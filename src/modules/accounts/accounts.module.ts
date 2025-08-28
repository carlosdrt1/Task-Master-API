import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { AccountsRepository } from './accounts.repository';

@Module({
  imports: [PrismaModule],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService],
})
export class AccountsModule {}
