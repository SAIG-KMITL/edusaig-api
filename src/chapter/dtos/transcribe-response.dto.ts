import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TranscribeResponseDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'transcription',
        type: String,
        example: ' popular interview question concerns the four core concepts in object-oriented programming.',
    })
    transcription: string;
}