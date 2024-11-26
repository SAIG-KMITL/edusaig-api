import { ExamAnswer } from 'src/exam-answer/exam-answer.entity';
import { Exam } from 'src/exam/exam.entity';
import { ExamAttemptStatus } from 'src/shared/enums';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ExamAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Exam, (exam) => exam.examAttempt, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @Column({ name: 'exam_id' })
  examId: String;

  @ManyToOne(() => User, (user) => user.examAttempt, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: String;

  @OneToMany(() => ExamAnswer, (examAnswer) => examAnswer.examAttempt, {
    cascade: true,
  })
  examAnswer: ExamAnswer[];

  @Column({
    nullable: false,
    default: 0,
    type: 'decimal',
  })
  score: number = 0;

  @Column({
    enum: ExamAttemptStatus,
    nullable: false,
  })
  status: ExamAttemptStatus;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  startedAt: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  submittedAt: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
