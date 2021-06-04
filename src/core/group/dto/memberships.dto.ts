import { GroupMember } from '../entities/group-member.entity';

export class MembershipsDto {
  count;
  memberships: GroupMember[];
}
