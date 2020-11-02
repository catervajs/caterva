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
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'text' })
  deviceId: string;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'text', nullable: true })
  googleId?: string;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'text', nullable: true })
  appleId?: string;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'text', nullable: true })
  facebookId?: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  location?: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  language?: string;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  metadata;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
