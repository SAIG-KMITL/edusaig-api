import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SummarizeResponseDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'summary',
        type: String,
        example: 'this is a summary of the chapter',
    })
    summary: string;
}