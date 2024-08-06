import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCrowdfundingDto } from './dto/create-crowdfunding.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CrowdfundingsService {
  constructor(private prisma: PrismaService) {}

  async createCrowdfunding(createCrowdfundingDto: CreateCrowdfundingDto) {
    const { project, neededValue } = createCrowdfundingDto;
    const projectExists = await this.prisma.project.findUnique({
      where: {
        id_project: project,
      },
    });
    if(!projectExists) throw new NotFoundException("ERRO: projeto não encontrado");
    if(neededValue < 0 || neededValue > 9999999) throw new ConflictException("ERRO: valor inválido");
    return this.prisma.crowdFunding.create({
      data: {
        ...createCrowdfundingDto,
      },
    });
  }

  async getCrowdfundingByProject(project: number) {
    const projectExists = await this.prisma.project.findUnique({
      where: {
        id_project: project,
      },
    });
    if(!projectExists) throw new NotFoundException("ERRO: projeto não encontrado");
    const count = await this.prisma.crowdFunding.count({where: {project}});
    const res = await this.prisma.crowdFunding.findMany({where: {project}});
    return {"response": res, "count": count};
  }

  async getCrowdfundingsByTitle(title: string, page: number) {
    return `This action returns all crowdfundings`;
  }

  async getCrowdfundingById(id: number) {
    return `This action returns a #${id} crowdfunding`;
  }

  async updateCrowdfundingNeededValue(id: number, newValue: number) {
    return `This action updates a #${id} crowdfunding`;
  }

  async closeCrowdfunding(id: number) {

  }
}
