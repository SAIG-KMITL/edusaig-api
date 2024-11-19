import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsEnum,
} from 'class-validator';
import { AvailableRoles, Role } from 'src/shared/enums';

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

  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    type: String,
    example: 'P@ssw0rd!',
  })
  password: string;

  @IsEnum(AvailableRoles)
  @IsNotEmpty()
  @ApiProperty({
    description: 'User role',
    type: String,
    example: AvailableRoles.STUDENT,
    enum: AvailableRoles,
  })
  role: Role;
}
