import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserBackground {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'User ID',
    type: String,
  })
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Occupation ID',
    type: String,
  })
  occupationId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @ApiProperty({
    description: 'Topic IDs',
    type: [String],
    default: [],
  })
  topics: string[];
}
