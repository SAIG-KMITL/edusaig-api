import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { UserBackgroundTopicResponseDto } from 'src/user-background-topic/dtos/user-background-response.dto';
import { UserOccupationResponseDto } from 'src/user-occupation/dtos/user-occupation-response.dto';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { UserBackground } from '../user-background.entity';

export class UserBackgroundResponseDto {
  @ApiProperty({
    description: 'User background ID',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'User data',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'User occupation data',
    type: UserOccupationResponseDto,
  })
  occupation: UserOccupationResponseDto;

  @ApiProperty({
    description: 'User background topics',
    type: UserBackgroundTopicResponseDto,
    isArray: true,
  })
  topics: UserBackgroundTopicResponseDto[];

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

  constructor(data: UserBackground) {
    this.id = data.id;
    this.user = data.user;
    this.occupation = data.occupation;
    this.topics = data.topics;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class PaginatedUserBackgroundResponseDto extends PaginatedResponse(
  UserBackgroundResponseDto,
) {
  constructor(
    userBackground: UserBackground[],
    total: number,
    page: number,
    limit: number,
  ) {
    super(
      userBackground.map((item) => new UserBackgroundResponseDto(item)),
      total,
      page,
      limit,
    );
  }
}
