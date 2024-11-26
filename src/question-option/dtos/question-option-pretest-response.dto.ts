import { ApiProperty } from '@nestjs/swagger';
import { QuestionOption } from '../question-option.entity';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { QuestionPretestResponseDto } from 'src/question/dtos/question-pretest-response.dto';

export class QuestionOptionPretestResponseDto {
  @ApiProperty({
    description: 'Question option ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Question Data',
    type: QuestionPretestResponseDto,
    example: {
      points: 1,
      orderIndex: 10,
      id: 'e99e39a0-edf0-470c-b8f1-9fe8fddd0ef3',
      examId: null,
      pretestId: '168eb5b6-9ba9-4e6d-9880-551d4232129e',
      question:
        "What is the difference between 'int()', 'float()', and 'str()' functions in Python?",
      type: 'pretest',
      createdAt: '2024-11-26T10:12:01.884Z',
      updatedAt: '2024-11-26T10:12:01.884Z',
      pretest: {
        timeLimit: 20,
        id: '168eb5b6-9ba9-4e6d-9880-551d4232129e',
        title: 'Biology',
        description: 'This course is an introduction to biology',
        passingScore: 3,
        maxAttempts: 1,
        user: {
          id: 'a12e1e37-3504-4711-a389-09a1734d7b1c',
          username: 'johndoe',
          fullname: 'John Doe',
          role: 'student',
          email: 'johndoe@gmail.com',
          profileKey: null,
        },
      },
    },
  })
  question: QuestionPretestResponseDto;

  @ApiProperty({
    description: 'Question option text',
    type: String,
    example: 'A. Rock',
  })
  optionText: string;

  @ApiProperty({
    description: 'Is this question option correct?',
    type: Boolean,
    example: false,
  })
  isCorrect: boolean;

  @ApiProperty({
    description: 'ehy this question option correct or incorrect?',
    type: String,
    example: 'Rock is not biology.',
  })
  explanation: string;

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

  constructor(questionOption: QuestionOption) {
    this.id = questionOption.id;
    this.question = questionOption.question;
    this.optionText = questionOption.optionText;
    this.isCorrect = questionOption.isCorrect;
    this.explanation = questionOption.explanation;
    this.createdAt = questionOption.createdAt;
    this.updatedAt = questionOption.updatedAt;
  }
}

export class PaginatedQuestionOptionPretestResponseDto extends PaginatedResponse(
  QuestionOptionPretestResponseDto,
) {
  constructor(
    questionOption: QuestionOption[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const questionOptionDtos = questionOption.map(
      (questionOption) => new QuestionOptionPretestResponseDto(questionOption),
    );
    super(questionOptionDtos, total, pageSize, currentPage);
  }
}
