import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { FriendshipOneWayRelationStatus } from '../enums/friendship-one-way-relation-status.enum';

@Entity()
@Check(`"aId" != "bId"`)
export class Friendship {
  @PrimaryColumn()
  aId: string;

  @PrimaryColumn()
  bId: string;

  @Column({
    type: 'enum',
    enum: FriendshipOneWayRelationStatus,
    default: FriendshipOneWayRelationStatus.NoAction,
  })
  status: FriendshipOneWayRelationStatus;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn()
  a?: Account;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn()
  b?: Account;
}
