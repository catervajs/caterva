import { ApiProperty } from '@nestjs/swagger';
import { GroupMember } from '../entities/group-member.entity';

export class MembershipsDto {
  @ApiProperty()
  count;

  @ApiProperty({ type: [GroupMember] })
  memberships: GroupMember[];
}
