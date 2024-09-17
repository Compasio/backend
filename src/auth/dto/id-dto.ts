import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IdDTO {
  @ApiProperty({type: String, description: "id", example: 1})
  @IsString()
  @IsNotEmpty()
  id: string;
}