import { ApiProperty } from '@nestjs/swagger';
import { LeaderboardEntryDto } from './leaderboard-entry.dto';

export class LeaderboardEntriesDto {
  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;

  @ApiProperty({ type: [LeaderboardEntryDto] })
  entries: LeaderboardEntryDto[];
}
