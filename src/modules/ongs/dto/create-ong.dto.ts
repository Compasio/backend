import { ApiProperty } from '@nestjs/swagger';
import { Themes_ONG } from '@prisma/client';
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

export class CreateOngDto {
    @ApiProperty({type: String, description: "CNPJ da Ong", example: "11223344556677"})
    @IsString()
    @IsNotEmpty()
    cnpj_ong: string;

    @ApiProperty({type: String, description: "CPF do fundador da Ong ou de quem está registrado", example: "12098755403"})
    @IsString()
    @IsNotEmpty()
    cpf_founder: string;

    @ApiProperty({type: String, description: "Nome da Ong", example: "Médicos Sem Fronteiras"})
    @IsString()
    @IsNotEmpty()
    ong_name: string;

    @ApiProperty({type: String, description: "Email princial da Ong", example: "medicossem@ong.com"})
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({type: String, description: "Senha da Ong", example: "OngOng1234@"})
    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    @ApiProperty({type: String, description: "Descrição da ong (tipo uma bio)", example: "Somos uma ong"})
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({type: Buffer, description: "Logo da ong", example: "slamano"})
    @IsString()
    @IsOptional()
    profile_picture: Buffer;

    @ApiProperty({ type: String, description: 'Áreas que a ong atua', example: ['Animais', 'Criancas']})
    @IsOptional()
    @IsArray()
    themes?: Themes_ONG[];

}
