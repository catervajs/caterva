import { LeaderboardEntryDto } from './leaderboard-entry.dto';

export class LeaderboardEntriesDto {
  offset?: number;
  limit?: number;
  entries?: LeaderboardEntryDto[];
}
