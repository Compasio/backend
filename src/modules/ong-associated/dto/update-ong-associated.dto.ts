import { PartialType } from '@nestjs/swagger';
import { CreateOngAssociatedDto } from './create-ong-associated.dto';

export class UpdateOngAssociatedDto extends PartialType(CreateOngAssociatedDto) {}
