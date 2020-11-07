import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [AccountModule, FriendModule],
  exports: [AccountModule, FriendModule],
})
export class CoreModule {}
