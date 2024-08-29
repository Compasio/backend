import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsDateString,
  IsISO8601
} from "class-validator";

export class CreateVoluntaryRelationDto {
    @ApiProperty({type: Number, description: "Voluntário", example: 1})
    @IsNumber()
    @IsNotEmpty()
    voluntary: number;

    @ApiProperty({type: Number, description: "Ong", example: 1})
    @IsNumber()
    @IsNotEmpty()
    ong: number;

    @ApiProperty({type: String, description: "Data de início", example: "2024-05-04"})
    @IsDateString()
    @IsOptional()
    dateStart: string;

    @ApiProperty({type: String, description: "Data de fim", example: "2024-05-05"})
    @IsDateString()
    @IsOptional()
    dateEnding: string;

    @ApiProperty({type: String, description: "Descrição opcional da relação", example: "Ajudou na cura de refugiados"})
    @IsString()
    @IsOptional()
    description: string;
}

export class DellVoluntaryRelationDto {
    @ApiProperty({type: Number, description: "Voluntário", example: 1})
    @IsNumber()
    @IsNotEmpty()
    voluntary: number;

    @ApiProperty({type: Number, description: "Ong", example: 1})
    @IsNumber()
    @IsNotEmpty()
    ong: number;
}
