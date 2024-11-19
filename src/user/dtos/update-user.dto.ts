import {
  IsString,
  IsOptional,
  IsStrongPassword,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'johndoe',
  })
  username?: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword()
  @ApiProperty({
    description: 'New User Password',
    type: String,
    example: 'P@ssw0rd!',
  })
  password?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    description: 'User points',
    type: Number,
    example: 100,
  })
  points?: number;
}
