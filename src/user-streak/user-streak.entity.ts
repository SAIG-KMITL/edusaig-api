import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserStreak {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.streaks, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  user: User;

  @Column({
    default: new Date(),
    nullable: false,
    type: 'timestamp with time zone',
  })
  currentStreak: Date;

  @Column({
    default: new Date(),
    nullable: false,
    type: 'timestamp with time zone',
  })
  longestStreak: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActivityDate: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date;
}
