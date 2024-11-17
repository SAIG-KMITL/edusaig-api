import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../enums/status.enum';
import { UserReward } from '../user-reward.entity';

export class UserRewardResponseDto {
  @ApiProperty({
    description: 'user-reward id',
    type: String,
    example: '4a3522e7-3080-46a6-83ff-778ce829e8ef',
  })
  id: string;

  @ApiProperty({
    description: 'user matched by id',
    type: Object,
    example: { id: '4a3522e7-3080-46a6-83ff-778ce829e8ef' },
  })
  user: { id: string };

  @ApiProperty({
    description: 'reward matched by id',
    type: Object,
    example: { id: '4a3522e7-3080-46a6-83ff-778ce829e8ef', name: 'reward' },
  })
  reward: { id: string; name: string };

  @ApiProperty({
    description: 'how many points user spent on this reward',
    type: Number,
    example: 100,
  })
  pointsSpent: number;

  @ApiProperty({
    description: 'status of reward',
    type: String,
    enum: Status,
    example: Status.DELIVERED,
  })
  status: Status;

  @ApiProperty({
    description: 'redeem date',
    type: Date,
    example: new Date(),
  })
  redeemedAt: Date;

  @ApiProperty({
    description: 'create date',
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'lastest update date',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  constructor(userReward: UserReward) {
    this.id = userReward.id;
    this.user = userReward.user;
    this.reward = userReward.reward;
    this.pointsSpent = userReward.pointsSpent;
    this.status = userReward.status;
    this.redeemedAt = userReward.redeemedAt;
    this.createdAt = userReward.createdAt;
    this.updatedAt = userReward.updatedAt;
  }
}
