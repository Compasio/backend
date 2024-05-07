import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Habilities_User } from '@prisma/client';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

//export class UpdateUserDto extends PartialType(CreateUserDto) 
export class UpdateUserDto {
    @ApiProperty({type: String, description: "Primeiro nome do usuário", example: "João"})
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({type: String, description: "Nome do meio e último nome do usuário", example: "da Silveira Silva"})
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty({type: String, description: "Descrição do usuário (tipo uma bio)", example: "Olá meu nome é João tenho 22 anos toco guitarra e adoro ajudar meus casas"})
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({ type: String, description: 'Habilidades do Usuário (ENUM com valores pré-determinados)', example: ['Violao', 'Professor']})
    @IsOptional()
    @IsArray()
    habilities?: Habilities_User[];

    @ApiProperty({type: Buffer, description: "Foto de perfil do usuário", example: "slamano"})
    @IsString()
    @IsOptional()
    profile_picture: Buffer;
}
