import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class RequestRelationDto {
    @ApiProperty({type: Number, description: "Voluntário", example: 1})
    @IsNumber()
    @IsNotEmpty()
    voluntary: number;

    @ApiProperty({type: Number, description: "Ong", example: 1})
    @IsNumber()
    @IsNotEmpty()
    ong: number;

    @ApiProperty({type: Number, description: "Voluntário", example: 1})
    @IsNumber()
    @IsOptional()
    project: number;
}