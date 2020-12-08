import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [ProfileModule, WalletModule],
})
export class ExtensionsModule {}
