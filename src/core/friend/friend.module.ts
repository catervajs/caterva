import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { FriendshipComposite } from './entities/friendship-composite-view.entity';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, FriendshipComposite])],
  providers: [FriendService],
  controllers: [FriendController],
  exports: [FriendService],
})
export class FriendModule {}
