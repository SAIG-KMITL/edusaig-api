import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { UserOccupation } from '../user-occupation.entity';

export class UserOccupationResponseDto {
  @ApiProperty({
    description: 'User occupation ID',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Occupation title',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'Occupation description',
    type: String,
  })
  description: string;

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

  constructor(userOccupation: UserOccupation) {
    this.id = userOccupation.id;
    this.title = userOccupation.title;
    this.description = userOccupation.description;
    this.createdAt = userOccupation.createdAt;
    this.updatedAt = userOccupation.updatedAt;
  }
}

export class PaginatedUserOccupationResponseDto extends PaginatedResponse(
  UserOccupationResponseDto,
) {
  constructor(
    userOccupations: UserOccupation[],
    total: number,
    page: number,
    limit: number,
  ) {
    super(
      userOccupations.map(
        (userOccupation: UserOccupation) =>
          new UserOccupationResponseDto(userOccupation),
      ),
      total,
      page,
      limit,
    );
  }
}
