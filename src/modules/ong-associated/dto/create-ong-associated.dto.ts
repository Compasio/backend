import { ApiProperty } from '@nestjs/swagger';
import { Permissions } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsEmail,
  IsJSON,
  ValidateNested,
  IsDate,
  IsDateString,
  IsUrl,
  isNumber,
  isNotEmpty,
  IsArray
} from 'class-validator';

export class CreateOngAssociatedDto {

    @ApiProperty({type: Number, description: "Ong", example: 1})
    @IsNumber()
    @IsNotEmpty()
    ongid: number;

    @ApiProperty({type: String, description: "Primeiro nome do associado", example: "João"})
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({type: String, description: "Nome do meio e último nome do associado", example: "da Silveira Silva"})
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty({type: String, description: "Email de acesso do associado", example: "joaosilveirasilva@gmail.com"})
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({type: String, description: "Senha do associado", example: "Joao1234@"})
    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    @ApiProperty({type: String, description: 'Permissões do associado', example: ['donation']})
    @IsArray()
    @IsNotEmpty()
    permissions: Permissions[]

}
