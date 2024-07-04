import { Injectable } from '@nestjs/common';
import { CreateCrowdfundingDto } from './dto/create-crowdfunding.dto';
import { UpdateCrowdfundingDto } from './dto/update-crowdfunding.dto';

@Injectable()
export class CrowdfundingsService {
  create(createCrowdfundingDto: CreateCrowdfundingDto) {
    return 'This action adds a new crowdfunding';
  }

  findAll() {
    return `This action returns all crowdfundings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} crowdfunding`;
  }

  update(id: number, updateCrowdfundingDto: UpdateCrowdfundingDto) {
    return `This action updates a #${id} crowdfunding`;
  }

  remove(id: number) {
    return `This action removes a #${id} crowdfunding`;
  }
}
