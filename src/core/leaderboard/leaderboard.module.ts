import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { RedisModule } from 'nestjs-redis';
import { LeaderboardController } from './leaderboard.controller';

@Module({
  imports: [
    RedisModule.register({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379/0',
      keyPrefix: 'lb:',
    }),
  ],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
