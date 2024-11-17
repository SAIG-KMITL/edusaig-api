import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'johndoe@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User username',
    type: String,
    example: 'johndoe',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User fullname',
    type: String,
    example: 'John Doe',
  })
  fullname: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'points for reward',
    type: Number,
    example: '200',
  })
  points: number;

  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    type: String,
    example: 'P@ssw0rd!',
  })
  password: string;
}
