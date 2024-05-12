import { ApiProperty } from '@nestjs/swagger';
import { Habilities_User } from '@prisma/client';
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

export class CreateVoluntierDto {
    @ApiProperty({type: String, description: "CPF do usuário", example: "12098755403"})
    @IsString()
    @IsNotEmpty()
    cpf_voluntier: string;

    @ApiProperty({type: String, description: "Primeiro nome do usuário", example: "João"})
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({type: String, description: "Nome do meio e último nome do usuário", example: "da Silveira Silva"})
    @IsString()
    @IsNotEmpty()
    lastname: string;

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
    
    @ApiProperty({type: Buffer, description: "Foto de perfil do usuário", example: "slamano"})
    @IsString()
    @IsOptional()
    profile_picture: Buffer;

    @ApiProperty({type: Date, description: "Data de nascimento usuário", example: "2003-09-21T18:19:31.966Z"})
    @IsDateString()
    @IsNotEmpty()
    birthDate: Date;

    @ApiProperty({type: String, description: "Descrição do usuário (tipo uma bio)", example: "Olá meu nome é João tenho 22 anos toco guitarra e adoro ajudar meus casas"})
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({ type: String, description: 'Habilidades do Usuário (ENUM com valores pré-determinados)', example: ['Violao', 'Professor']})
    @IsOptional()
    @IsArray()
    habilities?: Habilities_User[];
}


