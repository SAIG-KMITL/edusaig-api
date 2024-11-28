import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoadmapAiDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Roadmap AI Pretest Description',
    type: String,
    example: 'AI Roadmap',
  })
  preTestDescription: string;
}
