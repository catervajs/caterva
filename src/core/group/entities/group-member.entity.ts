import { GroupMembershipStatus } from '../enums/group-membership-status.enum';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Group } from './group.entity';
import { Account } from '../../account/entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class GroupMember {
  @ApiProperty()
  @PrimaryColumn()
  groupId: string;

  @ApiProperty()
  @PrimaryColumn()
  memberId: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: GroupMembershipStatus,
    default: GroupMembershipStatus.Member,
  })
  membershipStatus: GroupMembershipStatus;

  @ApiProperty({ type: () => Group })
  @ManyToOne(() => Group, (group) => group.members, { onDelete: 'CASCADE' })
  group: Group;

  @ApiProperty()
  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  member: Account;
}
