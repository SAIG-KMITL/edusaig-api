import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
export class CreateQuestionDto {
    @IsNotEmpty()
    @ApiProperty({
        description: 'Exam ID',
        type: String,
        example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
    })
    examId: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Question exam',
        type: String,
        example: 'What is this?',
    })
    question: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Type question',
        type: String,
        example: 'Open question',
    })
    type: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @ApiProperty({
        description: 'Points in 1 question',
        type: Number,
        example: 0,
    })
    points: number = 0;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiProperty({
        description: 'Order question',
        type: Number,
        example: 1,
    })
    orderIndex?: number;
}
