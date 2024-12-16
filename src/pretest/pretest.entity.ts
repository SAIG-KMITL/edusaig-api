import { ExamAttempt } from 'src/exam-attempt/exam-attempt.entity';
import { Question } from 'src/question/question.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pretest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.pretest, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: String;

  @OneToMany(() => ExamAttempt, (examAttempt) => examAttempt.pretest, {
    cascade: true,
  })
  examAttempt: ExamAttempt[];

  @OneToMany(() => Question, (question) => question.pretest, {
    cascade: true,
  })
  question: Question[];

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: false,
    default: 20,
  })
  timeLimit: number = 20;

  @Column({
    nullable: false,
  })
  passingScore: number;

  @Column({
    nullable: false,
  })
  maxAttempts: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
