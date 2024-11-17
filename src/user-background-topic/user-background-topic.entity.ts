import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserBackgroundTopicLevel } from './enums/user-background-topic-level.enum';

@Entity()
export class UserBackgroundTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: String,
    nullable: false,
  })
  title: string;

  @Column({
    type: String,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: UserBackgroundTopicLevel,
    nullable: false,
    default: UserBackgroundTopicLevel.BEGINNER,
  })
  level: UserBackgroundTopicLevel;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;
}
