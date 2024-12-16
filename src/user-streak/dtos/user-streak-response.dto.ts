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
    type: Date,
    example: new Date(),
  })
  currentStreak: Date;

  @ApiProperty({
    description: 'User longest streak',
    type: Date,
    example: new Date(),
  })
  longestStreak: Date;

  @ApiProperty({
    description: 'User last activity date',
    type: Date,
    example: new Date(),
  })
  lastActivityDate: Date;

  @ApiProperty({
    description: 'User created date',
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User updated date',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  constructor(userStreak: UserStreak) {
    this.id = userStreak.id;
    this.currentStreak = userStreak.currentStreak;
    this.longestStreak = userStreak.longestStreak;
    this.lastActivityDate = userStreak.lastActivityDate;
    this.createdAt = userStreak.createdAt;
    this.updatedAt = userStreak.updatedAt;
  }
}
