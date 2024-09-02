import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PassCodeDto {
  @ApiProperty({type: String, description: "Código", example: "123456"})
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({type: String, description: "Nova senha", example: "Joao1234@"})
  @IsString()
  @IsNotEmpty()
  password: string;
}