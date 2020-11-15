import { ApiProperty } from '@nestjs/swagger';
import { GroupMember } from '../entities/group-member.entity';

export class MembershipDto {
  @ApiProperty()
  membership: GroupMember;
}
