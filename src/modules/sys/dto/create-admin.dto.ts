import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsDateString,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class CreateAdminDto {
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
}
