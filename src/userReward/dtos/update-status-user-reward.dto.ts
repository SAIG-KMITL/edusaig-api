import { ApiProperty } from '@nestjs/swagger';
import { UserRewardStatus } from '../enums/user-reward-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusUserReward {
  @ApiProperty({
    description: 'status of user-reward',
    type: String,
    example: UserRewardStatus.EXPIRED,
    enum: UserRewardStatus,
  })
  @IsNotEmpty()
  @IsEnum(UserRewardStatus, {
    message: `status should be either ${UserRewardStatus.DELIVERED} ${UserRewardStatus.EXPIRED} or ${UserRewardStatus.PENDING}`,
  })
  status: UserRewardStatus;
}
