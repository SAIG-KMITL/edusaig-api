import { PartialType } from '@nestjs/swagger';
import { CreateUserBackgroundTopicDto } from './create-user-background-topic.dto';

export class UpdateUserBackgroundTopicDto extends PartialType(
  CreateUserBackgroundTopicDto,
) {}
