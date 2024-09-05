import { ApiProperty } from '@nestjs/swagger';
import { Habilities_User } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsEmail,
  IsDateString,
  IsArray
} from "class-validator";

export class CreateVoluntaryDto {
    @ApiProperty({type: String, description: "CPF do usuário", example: "12098755403"})
    @IsString()
    @IsNotEmpty()
    cpf_voluntary: string;

    @ApiProperty({type: String, description: "Nome completo do voluntário", example: "João Silveira Silva Silva Pinto"})
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({type: String, description: "Email do usuário", example: "joaosilveirasilva@gmail.com"})
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({type: String, description: "Senha do usuário", example: "Joao1234@"})
    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    @ApiProperty({type: String, description: "Data de nascimento usuário", example: "2003-09-21"})
    @IsDateString()
    @IsNotEmpty()
    birthDate: string;

    @ApiProperty({type: String, description: "Descrição do usuário (tipo uma bio)", example: "Olá meu nome é João tenho 22 anos toco guitarra e adoro ajudar meus casas"})
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({ type: String, description: 'Habilidades do Usuário (ENUM com valores pré-determinados)', example: ['LIDERANCA', 'INICIATIVA']})
    @IsOptional()
    @IsArray()
    habilities?: Habilities_User[];
}


