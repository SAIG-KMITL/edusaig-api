import { ApiProperty } from '@nestjs/swagger';

export class EvaluateResponseDto {
  @ApiProperty({
    description: 'The result of the evaluation',
    type: String,
    example: 'Passed',
  })
  result: string;

  constructor(result: string) {
    this.result = result;
  }
}
