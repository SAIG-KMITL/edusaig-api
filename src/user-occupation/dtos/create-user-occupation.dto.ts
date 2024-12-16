import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserOccupationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Occupation title',
    type: String,
    example: 'Software Engineer',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Occupation description',
    type: String,
    example: 'Software Engineer',
  })
  description: string;
}
