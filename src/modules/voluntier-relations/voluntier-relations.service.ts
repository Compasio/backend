import { Injectable } from '@nestjs/common';
import { CreateVoluntierRelationDto } from './dto/create-voluntier-relation.dto';
import { UpdateVoluntierRelationDto } from './dto/update-voluntier-relation.dto';

@Injectable()
export class VoluntierRelationsService {
  create(createVoluntierRelationDto: CreateVoluntierRelationDto) {
    return 'This action adds a new voluntierRelation';
  }

  findAll() {
    return `This action returns all voluntierRelations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voluntierRelation`;
  }

  update(id: number, updateVoluntierRelationDto: UpdateVoluntierRelationDto) {
    return `This action updates a #${id} voluntierRelation`;
  }

  remove(id: number) {
    return `This action removes a #${id} voluntierRelation`;
  }
}
