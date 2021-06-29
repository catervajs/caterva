import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'text' })
  deviceId?: string;

  @Index({ unique: true })
  @Column({ type: 'text', nullable: true })
  googleId?: string | null;

  @Index({ unique: true })
  @Column({ type: 'text', nullable: true })
  appleId?: string | null;

  @Index({ unique: true })
  @Column({ type: 'text', nullable: true })
  facebookId?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any | null;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
