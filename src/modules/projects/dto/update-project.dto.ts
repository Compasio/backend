import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Themes_ONG } from '@prisma/client';

export class UpdateProjectDto {
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
