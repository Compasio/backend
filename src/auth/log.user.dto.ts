import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LogUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Email do usuário' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Senha do usuário' })
  password: string;
}