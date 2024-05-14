import { PartialType } from '@nestjs/swagger';
import { CreateVoluntaryRelationDto } from './create-voluntary-relation.dto';

export class UpdateVoluntaryRelationDto extends PartialType(CreateVoluntaryRelationDto) {}
