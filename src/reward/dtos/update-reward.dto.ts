import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { Type } from '../enums/type.enum';
import { Status } from '../enums/status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRewardDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'reward name',
    type: String,
    example: 'gift card',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'description of reward (optional)',
    type: String,
    example: 'get 15% of in next course',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'thumbnail of reward (optional)',
    type: String,
    example: 'url.png',
  })
  thumbnail?: string;

  @IsEnum(Type, {
    message: `Invalid type. Type should be ${Type.BADGE} ${Type.CERTIFICATE} or ${Type.ITEM}`,
  })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'type of reward',
    type: String,
    example: Type.BADGE,
    enum: Type,
  })
  type?: Type.BADGE | Type.CERTIFICATE | Type.ITEM;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'how many points require for this reward',
    type: Number,
    example: 100,
  })
  points?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'how many reward left',
    type: Number,
    example: 5,
  })
  stock?: number;

  @IsEnum(Status, {
    message: `Invalid status. Status should be ${Status.ACTIVE} or ${Status.INACTIVE}`,
  })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'status of reward',
    type: String,
    example: Status.INACTIVE,
    enum: Status,
  })
  status?: Status.ACTIVE | Status.INACTIVE;
}
