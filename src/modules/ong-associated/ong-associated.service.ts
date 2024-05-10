import { Injectable } from '@nestjs/common';
import { CreateOngAssociatedDto } from './dto/create-ong-associated.dto';
import { UpdateOngAssociatedDto } from './dto/update-ong-associated.dto';

@Injectable()
export class OngAssociatedService {
  create(createOngAssociatedDto: CreateOngAssociatedDto) {
    return 'This action adds a new ongAssociated';
  }

  findAll() {
    return `This action returns all ongAssociated`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ongAssociated`;
  }

  update(id: number, updateOngAssociatedDto: UpdateOngAssociatedDto) {
    return `This action updates a #${id} ongAssociated`;
  }

  remove(id: number) {
    return `This action removes a #${id} ongAssociated`;
  }
}
