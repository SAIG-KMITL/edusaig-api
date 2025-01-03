import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateExamAnswerDto } from './create-exam-answer.dto';

export class UpdateExamAnswerDto extends PartialType(
  OmitType(CreateExamAnswerDto, ['selectedOptionId'] as const),
) {}
