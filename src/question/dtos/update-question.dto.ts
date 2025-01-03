import { OmitType, PartialType } from '@nestjs/swagger';
import {
  CreateQuestionDto,
  CreateQuestionPretestDto,
} from './create-question.dto';

export class UpdateQuestionDto extends PartialType(
  OmitType(CreateQuestionDto, ['examId'] as const),
) {}

export class UpdateQuestionPretestDto extends PartialType(
  OmitType(CreateQuestionPretestDto, ['pretestId'] as const),
) {}
