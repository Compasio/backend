import { ApiProperty } from '@nestjs/swagger';
import { Permissions } from "@prisma/client";
import {
  IsNotEmpty,
  IsArray, IsNumber
} from "class-validator";

export class SearchPermissionsDto {

  @ApiProperty({ type: Number, description: 'Ong', example: 1})
  @IsNotEmpty()
  @IsNumber()
  ongid: number;

  @ApiProperty({ type: Number, description: 'Página', example: 1})
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @ApiProperty({ type: String, description: 'Permissões do associado (ENUM com valores pré-determinados)', example: ['donations']})
  @IsNotEmpty()
  @IsArray()
  permission: Permissions[];
}