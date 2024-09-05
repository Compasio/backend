import { ApiProperty } from '@nestjs/swagger';
import { Habilities_User } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsEmail,
  IsDateString,
  IsArray, IsNumber
} from "class-validator";

export class SearchHabilityDto {

  @ApiProperty({ type: Number, description: 'Página', example: 1})
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @ApiProperty({ type: String, description: 'Habilidades do Usuário (ENUM com valores pré-determinados)', example: ['LIDERANCA', 'INICIATIVA']})
  @IsNotEmpty()
  @IsArray()
  hability: Habilities_User[];
}


