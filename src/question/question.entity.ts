import { ExamAnswer } from 'src/exam-answer/exam-answer.entity';
import { Exam } from 'src/exam/exam.entity';
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
    nullable: false,
  })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @Column({ name: 'exam_id' })
  examId: string;

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
  points: number;

  @Column({
    nullable: false,
    default: 1,
  })
  orderIndex: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
