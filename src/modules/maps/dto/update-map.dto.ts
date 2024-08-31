import { PartialType } from '@nestjs/mapped-types';
import { CreateMapDto } from './create-map.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { State } from '@prisma/client';

export class UpdateMapDto {
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
