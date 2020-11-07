import { ApiProperty } from '@nestjs/swagger';
import { FriendshipTwoWayRelationStatus } from '../enums/friendship-two-way-relation-status.enum';

export class FriendshipTwoWayRelationStatusDto {
  @ApiProperty()
  status: FriendshipTwoWayRelationStatus;
}
