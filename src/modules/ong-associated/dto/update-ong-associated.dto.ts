
import { Permissions } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsArray, IsOptional,
} from 'class-validator';

//export class UpdateOngAssociatedDto extends PartialType(CreateOngAssociatedDto) {}
export class UpdateOngAssociatedDto {
    @ApiProperty({type: String, description: "Primeiro nome do associado", example: "João"})
    @IsString()
    @IsOptional()
    firstname: string;

    @ApiProperty({type: String, description: "Nome do meio e último nome do associado", example: "da Silveira Silva"})
    @IsString()
    @IsOptional()
    lastname: string;

    @ApiProperty({type: String, description: 'Permissões do associado', example: ['donation']})
    @IsArray()
    @IsOptional()
    permissions: Permissions[]

}