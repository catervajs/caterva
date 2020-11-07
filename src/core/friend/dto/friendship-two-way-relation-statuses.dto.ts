import { ApiProperty } from '@nestjs/swagger';

export class FriendshipTwoWayRelationStatusesDto {
  @ApiProperty({ type: [String] })
  sentRequests: string[] = [];

  @ApiProperty({ type: [String] })
  receivedRequests: string[] = [];

  @ApiProperty({ type: [String] })
  friends: string[] = [];

  @ApiProperty({ type: [String] })
  blockedByYou: string[] = [];

  @ApiProperty({ type: [String] })
  blockedByOther: string[] = [];
}
