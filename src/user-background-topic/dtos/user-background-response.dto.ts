import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { UserBackgroundTopicLevel } from '../enums/user-background-topic-level.enum';
import { UserBackgroundTopic } from '../user-background-topic.entity';

export class UserBackgroundTopicResponseDto {
  @ApiProperty({
    description: 'User background topic ID',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'User Background Title',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'User Background Description',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'User Background Level',
    enum: UserBackgroundTopicLevel,
  })
  level: UserBackgroundTopicLevel;

  @ApiProperty({
    description: 'Created date',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated date',
    type: Date,
  })
  updatedAt: Date;

  constructor(userBackgroundTopic: UserBackgroundTopic) {
    this.id = userBackgroundTopic.id;
    this.title = userBackgroundTopic.title;
    this.description = userBackgroundTopic.description;
    this.level = userBackgroundTopic.level;
    this.createdAt = userBackgroundTopic.createdAt;
    this.updatedAt = userBackgroundTopic.updatedAt;
  }
}

export class PaginatedUserBackgroundTopicResponseDto extends PaginatedResponse(
  UserBackgroundTopicResponseDto,
) {
  constructor(
    userBackgroundTopics: UserBackgroundTopic[],
    total: number,
    page: number,
    limit: number,
  ) {
    super(
      userBackgroundTopics.map(
        (userBackgroundTopic) =>
          new UserBackgroundTopicResponseDto(userBackgroundTopic),
      ),
      total,
      page,
      limit,
    );
  }
}
