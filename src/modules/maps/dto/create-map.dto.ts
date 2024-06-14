import { ApiProperty } from '@nestjs/swagger';
import { State } from '@prisma/client';
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

export class CreateMapDto {

  @ApiProperty({type: String, description: "Numero", example: "36"})
  @IsString()
  @IsNotEmpty()
  num: string;

  @ApiProperty({type: String, description: "Rua, avenida, etc", example: "Avenida Paulista"})
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({type: String, description: "Bairro", example: "Bela Vista"})
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({type: String, description: "Cidade", example: "São Paulo"})
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({type: String, description: "Bairro", example: "SP"})
  @IsString()
  @IsNotEmpty()
  state: State;
}
