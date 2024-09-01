import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { PrismaService } from 'src/db/prisma.service';
const stripe = require('stripe')(process.env.STRIPE);

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async createDonation(createDonationDto: CreateDonationDto){
    const {voluntary, crowdfunding, stripe_checkout} = createDonationDto;
    
    const voluntaryExist = await this.prisma.voluntary.findFirst({
      where:{
        id_voluntary: voluntary,
      },
    });
    if(!voluntaryExist) throw new ConflictException("ERROR: Esse voluntario não existe");

    const crowdfundingExists = await this.prisma.crowdFunding.findFirst({
      where: {
        id_crowdfunding: crowdfunding,
      },
    });
    if(!crowdfundingExists) throw new ConflictException("ERROR: vaquinha não existe");

    try {
      let checkout = await stripe.checkout.sessions.listLineItems(stripe_checkout)
      let value = checkout.data[0].amount_total;

      let val = crowdfundingExists.collectedValue + value;
      await this.prisma.crowdFunding.update({
        data: {
          collectedValue: val,
        },
        where: {
          id_crowdfunding: crowdfunding,
        },
      });

      let date = new Date();
      let dd = String(date.getDate()).padStart(2, '0');
      let mm = String(date.getMonth() + 1).padStart(2, '0');
      let yyyy = date.getFullYear();

      return this.prisma.donationHistory.create({
        data:{
          ...createDonationDto,
          value: val,
          date: `${yyyy}-${mm}-${dd}`,
        },
      });
    } catch (e) {
      console.log(e)
      throw new ConflictException("ERROR: doação não efetuada");
    }

  }

  async getAllDonationsByOng(page: number, ong: number, date: string = '') {
    let projects;

    const ongExists = await this.prisma.ong.findUnique({
      where: {
        id_ong: ong,
      },
    });
    if(!ongExists) throw new NotFoundException("Error: ong não existe");

    if(page == 0) {
      projects = await this.prisma.project.findMany({
        where: {
          ong,
        },
      });
    }
    else if(page == 1) {
      projects = await this.prisma.project.findMany({
        where: {
          ong,
        },
        take: 20,
      });
    }
    else {
      projects = await this.prisma.project.findMany({
        where: {
          ong,
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }

    let crowdfundings = await this.prisma.crowdFunding.findMany({
      where: {
        project: {
          in: projects.map(({id_project}) => id_project)
        },
      },
    });

    let donations = await this.prisma.donationHistory.findMany({
      where: {
        crowdfunding: {
          in: crowdfundings.map(({id_crowdfunding}) => id_crowdfunding)
        }
      }
    })

    if(date != '{date}') {
      let donations2 = donations.filter(donation => donation.date === date)
      return {"response": donations2, "totalCount": donations2.length};
    }
    else {
      return {"response": donations, "totalCount": donations.length};
    }
  }

  async getAllDonationsByVoluntary(page: number, voluntary: number, date: string = '') {

    const voluntaryExists = await this.prisma.voluntary.findFirst({
      where: {
       id_voluntary: voluntary,
      },
    });
    if(!voluntaryExists) throw new NotFoundException("ERROR: voluntário não existe");

    let res;

    if(page == 0) {
      res = await this.prisma.donationHistory.findMany({
        where: {
          voluntary,
        },
      });
    }
    
    else if(page == 1) {
      res = await this.prisma.donationHistory.findMany({
        where: {
          voluntary,
        },
        take: 20,
      });
    }
    
    else {
      res = await this.prisma.donationHistory.findMany({
        where: {
          voluntary,
        },
        take:20,
        skip:(page - 1 ) * 20,
      });
    }

    if(date != '{date}') {
      res = res.filter(donation => donation.date === date);
    }
    
    return {"response": res, "count": res.length};
  }

  async getAllDonationsByCrowdfunding(page: number, crowdfunding: number, date: string = '') {
    let res;

    if(page == 0) {
      res = await this.prisma.donationHistory.findMany({
        where: {
          crowdfunding,
        },
      });
    }
    
    else if(page == 1) {
      res = await this.prisma.donationHistory.findMany({
        where: {
          crowdfunding,
        },
        take: 20,
      });
    }
    
    else {
      res = await this.prisma.donationHistory.findMany({
        where: {
          crowdfunding,
        },
        take:20,
        skip:(page - 1 ) * 20,
      });
    }

    if(date != '{date}') {
      res = res.filter(donation => donation.date === date);
    }
    
    return {"response": res, "count": res.length};
  }

  async getDonationById(id: number) {
    const donation = await this.prisma.donationHistory.findUnique({
      where:{
        id_donation: id,
      },
    });
    if(!donation) throw new NotFoundException("ERROR:Doação não encontrada");
    return donation;
  }
}
