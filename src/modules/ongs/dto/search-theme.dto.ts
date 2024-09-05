import { ApiProperty } from '@nestjs/swagger';
import { Themes_ONG } from "@prisma/client";
import {
  IsNotEmpty,
  IsArray, IsNumber
} from "class-validator";

export class SearchThemeDto {

  @ApiProperty({ type: Number, description: 'Página', example: 1})
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @ApiProperty({ type: String, description: 'Habilidades do Usuário (ENUM com valores pré-determinados)', example: ['SAUDE']})
  @IsNotEmpty()
  @IsArray()
  themes: Themes_ONG[];
}


