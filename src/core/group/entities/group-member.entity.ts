import { GroupMembershipStatus } from '../enums/group-membership-status.enum';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Group } from './group.entity';
import { Account } from '../../account/entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class GroupMember {
  @PrimaryColumn()
  groupId: string;

  @PrimaryColumn()
  memberId: string;

  @Column({
    type: 'enum',
    enum: GroupMembershipStatus,
    default: GroupMembershipStatus.Member,
  })
  membershipStatus: GroupMembershipStatus;

  @ManyToOne(() => Group, (group) => group.members, { onDelete: 'CASCADE' })
  group?: Group;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  member?: Account;
}
