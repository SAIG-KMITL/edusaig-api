import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../enums/status.enum';
import { IsNotEmpty } from 'class-validator';

export class UpdateStatusUserReward {
  @ApiProperty({
    description: 'status of user-reward',
    type: String,
    example: Status.EXPIRED,
    enum: Status,
  })
  @IsNotEmpty()
  status: Status;
}
