import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupMember } from './group-member.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Group {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'text', unique: true })
  name: string;

  @ApiProperty()
  @Column({ default: false })
  inviteOnly: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => [GroupMember] })
  @OneToMany(() => GroupMember, (groupMember) => groupMember.group)
  members: GroupMember[];
}
