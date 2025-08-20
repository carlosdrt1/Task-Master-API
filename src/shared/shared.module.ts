import { Module } from '@nestjs/common';
import { HashService } from './hasher/hasher.service';

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class SharedModule {}
