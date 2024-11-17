import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserRewardStatus } from './enums/user-reward-status.enum';
import { User } from 'src/user/user.entity';
import { Reward } from 'src/reward/reward.entity';

@Entity()
export class UserReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.rewards, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Reward, (reward) => reward.userReward, {
    onDelete: 'CASCADE',
  })
  reward: Reward;

  @Column({
    nullable: false,
  })
  pointsSpent: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserRewardStatus,
  })
  status: UserRewardStatus;

  //redeemed at
  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  redeemedAt: Date;

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
