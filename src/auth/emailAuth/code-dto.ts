import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CodeDto {
    @ApiProperty({type: String, description: "Código", example: "123456"})
    @IsString()
    @IsNotEmpty()
    code: string;
}