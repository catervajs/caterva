import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardEntryDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  rank: number;
}
