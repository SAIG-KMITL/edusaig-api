import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateExamAttemptDto } from './create-exam-attempt.dto';

export class UpdateExamAttemptDto extends PartialType(
  OmitType(CreateExamAttemptDto, ['examId'] as const),
) {}
