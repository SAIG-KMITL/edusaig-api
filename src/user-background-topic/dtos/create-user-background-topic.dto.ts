import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserBackgroundTopicLevel } from '../enums/user-background-topic-level.enum';

export class CreateUserBackgroundTopicDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title',
    type: String,
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Description',
    type: String,
  })
  description: string;

  @IsEnum(UserBackgroundTopicLevel)
  @ApiProperty({
    description: 'Level',
    enum: UserBackgroundTopicLevel,
    default: UserBackgroundTopicLevel.BEGINNER,
  })
  level: UserBackgroundTopicLevel;
}
