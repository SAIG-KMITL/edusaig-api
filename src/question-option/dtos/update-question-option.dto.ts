import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateQuestionOptionDto } from './create-question-option.dto';

export class UpdateQuestionOptionDto extends PartialType(
  OmitType(CreateQuestionOptionDto, ['questionId'] as const),
) {}
