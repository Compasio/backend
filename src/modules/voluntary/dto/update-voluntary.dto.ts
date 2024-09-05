import { PartialType } from '@nestjs/swagger';
import { CreateVoluntaryDto } from './create-voluntary.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Habilities_User } from '@prisma/client';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

//export class UpdateUserDto extends PartialType(CreateUserDto) 
export class UpdateVoluntaryDto {
    @ApiProperty({type: String, description: "Nome completo do usuário", example: "João Silveira Silva Silva Pinto"})
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({type: String, description: "Descrição do usuário (tipo uma bio)", example: "Olá meu nome é João tenho 22 anos toco guitarra e adoro ajudar meus casas"})
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({ type: String, description: 'Habilidades do Usuário (ENUM com valores pré-determinados)', example: ['INICIATIVA', 'LIDERANCA']})
    @IsOptional()
    @IsArray()
    habilities?: Habilities_User[];
}
