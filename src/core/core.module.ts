import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { FriendModule } from './friend/friend.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [AccountModule, FriendModule, GroupModule],
  exports: [AccountModule, FriendModule, GroupModule],
})
export class CoreModule {}
