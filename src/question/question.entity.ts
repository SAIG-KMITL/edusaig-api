import { ExamAnswer } from 'src/exam-answer/exam-answer.entity';
import { Exam } from 'src/exam/exam.entity';
import { Pretest } from 'src/pretest/pretest.entity';
import { QuestionOption } from 'src/question-option/question-option.entity';
import { QuestionType } from 'src/shared/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
@Entity()
@Unique(['examId', 'orderIndex'])
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Exam, (exam) => exam.question, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @Column({ name: 'exam_id', nullable: true })
  examId: string;

  @ManyToOne(() => Pretest, (pretest) => pretest.question, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'pretest_id' })
  pretest: Pretest;

  @Column({ name: 'pretest_id', nullable: true })
  pretestId: string;

  @OneToMany(
    () => QuestionOption,
    (questionOption) => questionOption.question,
    {
      cascade: true,
    },
  )
  questionOption: QuestionOption[];

  @OneToMany(() => ExamAnswer, (examAnswer) => examAnswer.question, {
    cascade: true,
  })
  examAnswer: ExamAnswer[];

  @Column({
    nullable: false,
  })
  question: string;

  @Column({
    nullable: false,
  })
  type: QuestionType;

  @Column({
    nullable: false,
    default: 1,
  })
  points: number = 1;

  @Column({
    nullable: false,
    default: 1,
  })
  orderIndex: number = 1;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
