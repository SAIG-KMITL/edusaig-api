import { ApiProperty } from '@nestjs/swagger';
import { UserStreak } from '../user-streak.entity';

export class UserStreakResponseDto {
  @ApiProperty({
    description: 'User streak ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User current streak',
    type: Number,
    example: 0,
  })
  currentStreak: number;

  @ApiProperty({
    description: 'User longest streak',
    type: Number,
    example: 0,
  })
  longestStreak: number;

  @ApiProperty({
    description: 'User last activity date',
    type: Date,
    example: '2021-08-01T00:00:00.000Z',
  })
  lastActivityDate: Date;

  @ApiProperty({
    description: 'User created date',
    type: Date,
    example: '2021-08-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User updated date',
    type: Date,
    example: '2021-08-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  constructor(userStreak: UserStreak) {
    this.id = userStreak.id;
    this.currentStreak = userStreak.currentStreak;
    this.longestStreak = userStreak.longestStreak;
    this.lastActivityDate = userStreak.lastActivityDate;
    this.createdAt = userStreak.createdAt;
    this.updatedAt = userStreak.updatedAt;
    this.userId = userStreak.user.id;
  }
}
