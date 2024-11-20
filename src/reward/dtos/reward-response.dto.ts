import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../enums/status.enum';
import { Type } from '../enums/type.enum';
import { Reward } from '../reward.entity';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';

export class RewardResponseDto {
  @ApiProperty({
    description: 'Reward ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  id: string;

  @ApiProperty({
    description: 'reward name',
    type: String,
    example: 'gift card',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'description of reward (optional)',
    type: String,
    example: 'get 15% of in next course',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'thumbnail of reward (optional)',
    type: String,
    example: 'url.png',
  })
  thumbnail: string;

  @ApiProperty({
    description: 'type of reward',
    type: String,
    example: Type.BADGE,
    enum: Type,
  })
  type: Type;

  @ApiProperty({
    description: 'how many points require for this reward',
    type: Number,
    example: 100,
  })
  points: number;

  @ApiProperty({
    description: 'how many reward left',
    type: Number,
    example: 5,
  })
  stock: number;

  @ApiProperty({
    description: 'status of reward',
    type: String,
    example: Status.INACTIVE,
    enum: Status,
  })
  status: Status;

  @ApiProperty({
    description: 'created date',
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'updated date',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  constructor(reward: Reward) {
    this.id = reward.id;
    this.name = reward.name;
    this.description = reward.description;
    this.thumbnail = reward.thumbnail;
    this.type = reward.type;
    this.points = reward.points;
    this.stock = reward.stock;
    this.status = reward.status;
    this.createdAt = reward.createdAt;
    this.updatedAt = reward.updatedAt;
  }
}
export class PaginatedRewardResponseDto extends PaginatedResponse(
  RewardResponseDto,
) {
  constructor(
    rewards: Reward[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const rewardDtos = rewards.map((reward) => new RewardResponseDto(reward));
    super(rewardDtos, total, pageSize, currentPage);
  }
}
