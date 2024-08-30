import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BlacklistDto {
  @ApiProperty({type: Number, description: "id", example: 1})
  @IsNumber()
  @IsNotEmpty()
  id: number;
}