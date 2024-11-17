import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../enums/status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusUserReward {
  @ApiProperty({
    description: 'status of user-reward',
    type: String,
    example: Status.EXPIRED,
    enum: Status,
  })
  @IsNotEmpty()
  @IsEnum(Status, {
    message: `status should be either ${Status.DELIVERED} ${Status.EXPIRED} or ${Status.PENDING}`,
  })
  status: Status;
}
