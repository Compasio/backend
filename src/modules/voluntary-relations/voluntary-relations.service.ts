import { Injectable } from '@nestjs/common';
import { CreateVoluntaryRelationDto } from './dto/create-voluntary-relation.dto';
import { UpdateVoluntaryRelationDto } from './dto/update-voluntary-relation.dto';

@Injectable()
export class VoluntaryRelationsService {
  create(createvoluntaryRelationDto: CreateVoluntaryRelationDto) {
    return 'This action adds a new voluntaryRelation';
  }

  findAll() {
    return `This action returns all voluntaryRelations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voluntaryRelation`;
  }

  update(id: number, updatevoluntaryRelationDto: UpdateVoluntaryRelationDto) {
    return `This action updates a #${id} voluntaryRelation`;
  }

  remove(id: number) {
    return `This action removes a #${id} voluntaryRelation`;
  }
}
