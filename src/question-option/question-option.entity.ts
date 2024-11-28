import { ExamAnswer } from 'src/exam-answer/exam-answer.entity';
import { Question } from 'src/question/question.entity';
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
export class QuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Question, (question) => question.questionOption, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ name: 'question_id' })
  questionId: string;

  @OneToMany(() => ExamAnswer, (examAnswer) => examAnswer.selectedOption, {
    cascade: true,
  })
  examAnswer: ExamAnswer[];

  @OneToMany(() => ExamAnswer, (examAnswer) => examAnswer.correctAnswer, {
    cascade: true,
  })
  examAnswerCorrect: ExamAnswer[];

  @Column({
    nullable: false,
  })
  optionText: string;

  @Column({
    nullable: false,
  })
  isCorrect: boolean;

  @Column({
    nullable: false,
  })
  explanation: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
