import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsDateString,
  isNumber,
  IsArray,
} from 'class-validator';
import { Themes_ONG } from '@prisma/client';

export class CreateProjectDto {

    @ApiProperty({type: Number, description: "id da ONG", example: 1})
    @IsNotEmpty()
    // @IsNumber()
    ong : number

    @ApiProperty({type: String, description: "Nome do projeto", example: "Ajuda RS"})
    @IsNotEmpty()
    @IsString()
    project_name : string

    @ApiProperty({type: String, description: "Descrição do projeto", example: "Escreva aqui a descrição"})
    @IsString()
    @IsOptional()
    description : string

    @ApiProperty({type: Number, description: "Tema do projeto", example: ["Animais"]})
    @IsOptional()
    @IsArray()
    theme?: Themes_ONG[]

} 
