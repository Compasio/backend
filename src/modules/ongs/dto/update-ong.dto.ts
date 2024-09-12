import { PartialType } from '@nestjs/mapped-types';
import { CreateOngDto } from './create-ong.dto';
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
    IsArray,
  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Themes_ONG } from '@prisma/client';

//export class UpdateOngDto extends PartialType(CreateOngDto) {}
export class UpdateOngDto {
    @ApiProperty({type: String, description: "Nome da Ong", example: "Médicos Sem Fronteiras"})
    @IsString()
    @IsOptional()
    ong_name?: string;

    @ApiProperty({type: String, description: "Descrição da ong (tipo uma bio)", example: "Somos uma ong"})
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ type: String, description: 'Áreas que a ong atua', example: ['EDUCACAO', 'SAUDE']})
    @IsOptional()
    @IsArray()
    themes?: Themes_ONG[];
}
