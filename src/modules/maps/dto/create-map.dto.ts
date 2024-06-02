import { ApiProperty } from '@nestjs/swagger';
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

enum State {
    AC,
    AL,
    AP,
    AM,
    BA,
    CE,
    DF,
    ES,
    GO,
    MA,
    MT,
    MS,
    MG,
    PA,
    PB,
    PR,
    PE,
    PI,
    RR,
    RO,
    RJ,
    RN,
    RS,
    SC,
    SE,
    TO,
}

export class CreateMapDto {

  @ApiProperty({type: Number, description: "Numero", example: 36})
  @IsNumber()
  @IsNotEmpty()
  num: number;

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
