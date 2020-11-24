import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { FriendModule } from './friend/friend.module';
import { GroupModule } from './group/group.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [AccountModule, FriendModule, GroupModule, LeaderboardModule],
  exports: [AccountModule, FriendModule, GroupModule, LeaderboardModule],
})
export class CoreModule {}
