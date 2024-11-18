import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateRoadmapDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Roadmap duration',
    type: String,
    example: '2 months',
  })
  duration: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Roadmap priority',
    type: Number,
    example: 1,
  })
  priority: number;

  @IsUUID('4', { each: true })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Roadmap courses',
    type: [String],
    example: ['8d4887aa-28e7-4d0e-844c-28a8ccead003'],
  })
  courses: string[];
}
