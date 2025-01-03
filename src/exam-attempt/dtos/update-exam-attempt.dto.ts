import { OmitType, PartialType } from '@nestjs/swagger';
import {
  CreateExamAttemptDto,
  CreateExamAttemptPretestDto,
} from './create-exam-attempt.dto';

export class UpdateExamAttemptDto extends PartialType(
  OmitType(CreateExamAttemptDto, ['examId'] as const),
) {}

export class UpdateExamAttemptPretestDto extends PartialType(
  OmitType(CreateExamAttemptPretestDto, ['pretestId'] as const),
) {}
