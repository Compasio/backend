import { ApiProperty } from '@nestjs/swagger';
import { Permissions } from '@prisma/client';
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

export class CreateDonationDto {
    @ApiProperty({type: Number, description: "ID Do voluntario", example: 1})
    @IsNotEmpty()
    @IsNumber()
    voluntary: number

    @ApiProperty({type: Number, description: "Ong", example: 1})
    @IsOptional()
    @IsNumber()
    ong: number

    @ApiProperty({type: Number, description: "Vaquinha",example: 1})
    @IsOptional()
    @IsNumber()
    crowdfunding : number

    @ApiProperty({type: Number, description: "Valor da doação", example: 1})
    @IsNotEmpty()
    @IsNumber()
    value : number
}