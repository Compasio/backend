import { PartialType } from '@nestjs/swagger';
import { CreateVoluntierRelationDto } from './create-voluntier-relation.dto';

export class UpdateVoluntierRelationDto extends PartialType(CreateVoluntierRelationDto) {}
