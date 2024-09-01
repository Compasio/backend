import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCrowdfundingDto } from './dto/create-crowdfunding.dto';
import { PrismaService } from 'src/db/prisma.service';
const stripe = require('stripe')(process.env.STRIPE);

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

    const newProductStripe = await stripe.products.create({
      name: createCrowdfundingDto.title,
    });
    const newPriceStripe = await stripe.prices.create({
      currency: 'brl',
      custom_unit_amount: {
        enabled: true,
      },
      product: newProductStripe.id,
    });

    return this.prisma.crowdFunding.create({
      data: {
        ...createCrowdfundingDto,
        stripe_id: newProductStripe.id,
        stripe_price_id: newPriceStripe.id,
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

  async getCrowdfundingsByTitle(title: string) {
    const crowdNearest = await this.prisma.crowdFunding.findMany({
      where: {
        OR: [
          {title: {contains: title, mode: 'insensitive'}},
        ],
      },
    });

    if(!crowdNearest) throw new NotFoundException('ERROR: Nenhuma vaquinha com esse título');
    return crowdNearest;
  }

  async getCrowdfundingById(id: number) {
    const crowdFunding = await this.prisma.crowdFunding.findUnique({
      where: {
        id_crowdfunding: id,
      },
    });
    if(!crowdFunding) throw new NotFoundException("ERROR: Vaquinha não encontrada");
    return crowdFunding;
  }

  async updateCrowdfundingNeededValue(id: number, newValue: number) {
    const crowdfunding = await this.prisma.crowdFunding.findUnique({
      where: {
        id_crowdfunding: id,
      },
    });

    if(!crowdfunding) throw new NotFoundException("ERROR: Vaquinha não encontrada");

    return this.prisma.crowdFunding.update({
      data: {
        neededValue: newValue,
      },
      where: {
        id_crowdfunding: id,
      },
    });
  }

  async closeCrowdfunding(id: number) {
    const crowdfunding = await this.prisma.crowdFunding.findUnique({
      where: {
        id_crowdfunding: id,
      },
    });

    if(!crowdfunding) throw new NotFoundException("ERROR: Vaquinha não encontrada");

    return this.prisma.crowdFunding.update({
      data: {
        isClosed: true,
      },
      where: {
        id_crowdfunding: id,
      },
    });
  }
}
