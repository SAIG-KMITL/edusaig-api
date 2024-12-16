import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { Type } from '../enums/type.enum';
import { Status } from '../enums/status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'reward name',
    type: String,
    example: 'gift card',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'description of reward (optional)',
    type: String,
    example: 'get 15% of in next course',
  })
  description?: string;

  @IsEnum(Type, {
    message: `Invalid type. Type should be ${Type.BADGE} ${Type.CERTIFICATE} or ${Type.ITEM}`,
  })
  @IsNotEmpty()
  @ApiProperty({
    description: 'type of reward',
    type: String,
    example: Type.BADGE,
    enum: Type,
  })
  type: Type.BADGE | Type.CERTIFICATE | Type.ITEM;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'how many points require for this reward',
    type: Number,
    example: 100,
  })
  points: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'how many reward left',
    type: Number,
    example: 5,
  })
  stock: number;

  @IsEnum(Status, {
    message: `Invalid status. Status should be ${Status.ACTIVE} or ${Status.INACTIVE}`,
  })
  @IsNotEmpty()
  @ApiProperty({
    description: 'status of reward',
    type: String,
    example: Status.INACTIVE,
    enum: Status,
  })
  status: Status.ACTIVE | Status.INACTIVE;
}
