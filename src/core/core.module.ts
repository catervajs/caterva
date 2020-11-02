import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';

@Module({ imports: [AccountModule], exports: [AccountModule] })
export class CoreModule {}
