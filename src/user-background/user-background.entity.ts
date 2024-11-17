import { UserBackgroundTopic } from 'src/user-background-topic/user-background-topic.entity';
import { UserOccupation } from 'src/user-occupation/user-occupation.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserBackground {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToMany(() => UserBackgroundTopic, (topic) => topic.userBackgrounds)
  @JoinTable({
    name: 'user_background_topics_mapping',
    joinColumn: {
      name: 'user_background_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'topic_id',
      referencedColumnName: 'id',
    },
  })
  topics: UserBackgroundTopic[];

  @ManyToOne(() => UserOccupation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occupation_id' })
  occupation: UserOccupation;

  @Column({ name: 'occupation_id' })
  occupationId: string;

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
