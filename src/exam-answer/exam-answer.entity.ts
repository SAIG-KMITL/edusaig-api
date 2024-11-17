import { ExamAttempt } from 'src/exam-attempt/exam-attempt.entity';
import { QuestionOption } from 'src/question-option/question-option.entity';
import { Question } from 'src/question/question.entity';
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
export class ExamAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ExamAttempt, (examAttempt) => examAttempt.examAnswer, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'exam_attempt_id' })
  examAttempt: ExamAttempt;

  @Column({ name: 'exam_attempt_id' })
  examAttemptId: string;

  @ManyToOne(() => Question, (question) => question.examAnswer, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ name: 'question_id' })
  questionId: string;

  @ManyToOne(
    () => QuestionOption,
    (questionOption) => questionOption.examAnswer,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'question_option_id' })
  selectedOption: QuestionOption;

  @Column({ name: 'question_option_id' })
  selectedOptionId: string;

  @Column({
    nullable: false,
  })
  answerText: string;

  @Column({
    nullable: true,
    type: Boolean,
  })
  isCorrect: boolean;

  @Column({
    nullable: false,
    default: 0,
  })
  points: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
