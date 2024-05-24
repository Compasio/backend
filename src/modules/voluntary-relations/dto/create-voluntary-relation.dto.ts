import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsDateString,
} from 'class-validator';

export class CreateVoluntaryRelationDto {
    @ApiProperty({type: Date, description: "Data de início", example: "2024-05-04T00:00:00.000Z"})
    @IsDateString()
    @IsNotEmpty()
    dateStart: Date;

    @ApiProperty({type: Date, description: "Data de fim", example: "2024-05-05T00:00:00.000Z"})
    @IsDateString()
    @IsNotEmpty()
    dateEnding: Date;

    @ApiProperty({type: String, description: "Descrição opcional da relação", example: "Ajudou na cura de refugiados"})
    @IsString()
    @IsOptional()
    description: string;
}
