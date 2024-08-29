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

export class CreateCrowdfundingDto {
    @ApiProperty({type: String, description: 'Título da vaquinha', example: 'Vaquinha'})
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({type: String, description: 'Descrição da vaquinha', example: 'Vaquinha'})
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({type: Number, description: "Id do projeto", example: 1})
    @IsNumber()
    @IsNotEmpty()
    project: number;

    @ApiProperty({type: Number, description: "Valor a ser atingido", example: 36.25})
    @IsNumber()
    @IsNotEmpty()
    neededValue: number;
}
