import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../../core/account/entities/account.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Wallet {
  @ApiProperty()
  @PrimaryColumn()
  userId: string;

  @ApiProperty()
  @Column({ type: 'integer', nullable: false, default: 1000 })
  normalCurrency: number;

  @ApiProperty()
  @Column({ type: 'integer', nullable: false, default: 50 })
  premiumCurrency: number;

  @ApiPropertyOptional()
  @OneToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Account;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
