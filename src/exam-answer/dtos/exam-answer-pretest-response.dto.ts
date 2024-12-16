import { ApiProperty } from '@nestjs/swagger';
import { ExamAnswer } from '../exam-answer.entity';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { ExamAttempt } from 'src/exam-attempt/exam-attempt.entity';
import { Question } from 'src/question/question.entity';
import { QuestionOption } from 'src/question-option/question-option.entity';
import { ExamAttemptResponseDto } from 'src/exam-attempt/dtos/exam-attempt-response.dto';

export class ExamAnswerPretestResponseDto {
  @ApiProperty({
    description: 'Exam Answer ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Exam Attempt Data',
    type: ExamAttemptResponseDto,
    example: {
      score: '0',
      id: '195abd69-0c8f-4fd3-88cb-e02e08917b1f',
      status: 'in_progress',
      startedAt: '2024-11-27T11:11:10.292Z',
      submittedAt: null,
      user: {
        id: 'a12e1e37-3504-4711-a389-09a1734d7b1c',
      },
    },
  })
  examAttempt: ExamAttemptResponseDto;

  @ApiProperty({
    description: 'Question Data',
    type: Question,
    example: {
      points: 1,
      orderIndex: 1,
      id: 'b43d7571-f371-48a9-bee0-542f6fe154bb',
      question:
        'What is the primary function of a microprocessor in a computer system?',
      type: 'pretest',
      pretest: {
        timeLimit: 20,
        id: 'b269a451-87a9-41f8-86be-d5c3ecdfa934',
        title: 'Biology',
        description: 'This course is an introduction to biology',
        passingScore: 3,
        maxAttempts: 1,
        user: {
          id: 'b269a451-87a9-41f8-86be-d5c3ecdfa934',
        },
      },
    },
  })
  question: Question;

  @ApiProperty({
    description: 'Select Question Data',
    type: QuestionOption,
    example: {
      id: '9d77c1d9-b0d1-4025-880c-48073e9dc7d5',
      questionId: '1e251a62-6339-4a59-bb56-e338f1dae55b',
      isCorrect: false,
      explanation: 'Rock is not biology.',
      optionText: 'ROM',
    },
  })
  selectedOption: QuestionOption;

  @ApiProperty({
    description: 'Select Question Data',
    type: QuestionOption,
    example: {
      id: '9d77c1d9-b0d1-4025-880c-48073e9dc7d5',
      questionId: '1e251a62-6339-4a59-bb56-e338f1dae55b',
      isCorrect: true,
      explanation: 'Rock is not biology.',
      optionText: 'ROM',
    },
  })
  correctAnswer: QuestionOption;

  @ApiProperty({
    description: 'Answer text',
    type: String,
    example: 'biology',
  })
  answerText: string;

  @ApiProperty({
    description: 'Is answer correct?',
    type: Boolean,
    example: false,
  })
  isCorrect: boolean;

  @ApiProperty({
    description: 'Points in this answer',
    type: Number,
    example: 0,
  })
  points: number = 0;

  @ApiProperty({
    description: 'Exam created date',
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Exam updated date',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  constructor(examAnswer: ExamAnswer) {
    this.id = examAnswer.id;
    this.examAttempt = examAnswer.examAttempt;
    this.question = examAnswer.question;
    this.selectedOption = examAnswer.selectedOption;
    this.correctAnswer = examAnswer.correctAnswer;
    this.isCorrect = examAnswer.isCorrect;
    this.points = examAnswer.points;
    this.createdAt = examAnswer.createdAt;
    this.updatedAt = examAnswer.updatedAt;
  }
}

export class PaginatedExamAnswerPretestResponseDto extends PaginatedResponse(
  ExamAnswerPretestResponseDto,
) {
  constructor(
    examAnswer: ExamAnswer[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const examAnswerDtos = examAnswer.map(
      (examAnswer) => new ExamAnswerPretestResponseDto(examAnswer),
    );
    super(examAnswerDtos, total, pageSize, currentPage);
  }
}
