import { PartialType } from '@nestjs/swagger';
import { CreateOngAssociatedDto } from './create-ong-associated.dto';
import { Permissions } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsArray
  } from 'class-validator';

//export class UpdateOngAssociatedDto extends PartialType(CreateOngAssociatedDto) {}
export class UpdateOngAssociatedDto {
    @ApiProperty({type: String, description: "Primeiro nome do associado", example: "João"})
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({type: String, description: "Nome do meio e último nome do associado", example: "da Silveira Silva"})
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty({type: String, description: 'Permissões do associado', example: ['donation']})
    @IsArray()
    @IsNotEmpty()
    permissions: Permissions[]

}