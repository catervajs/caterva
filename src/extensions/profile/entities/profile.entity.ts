import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../../core/account/entities/account.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Profile {
  @ApiProperty()
  @PrimaryColumn()
  userId: string;

  @ApiProperty()
  @Column({ type: 'text' })
  displayName: string;

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  @ApiProperty()
  @Column({ type: 'integer', default: 1 })
  level: number;

  @ApiPropertyOptional()
  @OneToOne(() => Account)
  @JoinColumn()
  user: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
