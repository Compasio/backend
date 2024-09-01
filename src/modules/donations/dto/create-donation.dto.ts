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

export class CreateDonationDto {
    @ApiProperty({type: Number, description: "ID Do voluntario", example: 1})
    @IsNotEmpty()
    @IsNumber()
    voluntary: number

    @ApiProperty({type: Number, description: "Vaquinha",example: 1})
    @IsOptional()
    @IsNumber()
    crowdfunding : number

    @ApiProperty({type: String, description: "Id do checkout da stripe", example: 'cs_test_a11YYufWQzNY63zpQ6QSNRQhkUpVph4WRmzW0zWJO2znZKdVujZ0N0S22u'})
    @IsNotEmpty()
    @IsString()
    stripe_checkout : string
}