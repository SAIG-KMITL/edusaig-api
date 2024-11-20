import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Type } from './enums/type.enum';
import { Status } from './enums/status.enum';
import { UserReward } from 'src/user-reward/user-reward.entity';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({})
  description: string;

  @Column()
  thumbnail: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Type,
  })
  type: Type;

  @Column({
    nullable: false,
  })
  points: number;

  @Column({
    nullable: false,
  })
  stock: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Status,
  })
  status: Status;

  @OneToMany(() => UserReward, (userReward) => userReward.reward)
  userReward: UserReward;

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
