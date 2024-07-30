import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async createDonation(createDonationDto: CreateDonationDto){
    const {voluntary, crowdfunding, ong} = createDonationDto;

    if(ong == undefined && crowdfunding == undefined) throw new ConflictException("ERROR: Ong ou Crowdfunding precisam estar prenchidos");
    
    const voluntaryExist = await this.prisma.voluntary.findFirst({
      where:{
        id_voluntary: voluntary,
      },
    });
    if(!voluntaryExist) throw new ConflictException("ERROR: Esse voluntario não existe");

    if(crowdfunding != undefined) {
      const crowdfundingExists = await this.prisma.crowdFunding.findFirst({
        where: {
          id_crowdfunding: crowdfunding,
        },
      });
      if(!crowdfundingExists) throw new ConflictException("ERROR: vaquinha não existe");
    }

    if(ong != undefined) {
      const ongExists = await this.prisma.ong.findFirst({
        where: {
          id_ong: ong,
        },
      });
      if(!ongExists) throw new ConflictException("ERROR: vaquinha não existe");  
    }


    return this.prisma.donationHistory.create({
      data:{
        ...createDonationDto
      }
    })
  }

  async getAllDonationsByOng(page: number, ong: number, date: string = undefined) {
    let res;
    let count = await this.prisma.donationHistory.count({where: {ong, date}});

    if(page == 0) {
      res = await this.prisma.donationHistory.findMany({
        where: {
          ong,
          date,
        },
      });
    }
    
    else if(page == 1) {
      res = await this.prisma.donationHistory.findMany({
        where: {
          ong,
          date,
        },
        take: 20,
      });
    }
    
    else {
      res = await this.prisma.donationHistory.findMany({
        where: {
          ong,
          date,
        },
        take:20,
        skip:(page - 1 ) * 20,
      });
    }
    
    return {"response": res, "count": count};
  }

  async getAllDonationsByVoluntary(page: number, voluntary: number, date: string = undefined) {
    let res;
    let count = await this.prisma.donationHistory.count({where: {voluntary, date}});

    if(page == 0) {
      res = await this.prisma.donationHistory.findMany({
        where: {
          voluntary,
          date,
        },
      });
    }
    
    else if(page == 1) {
      res = await this.prisma.donationHistory.findMany({
        where: {
          voluntary,
          date,
        },
        take: 20,
      });
    }
    
    else {
      res = await this.prisma.donationHistory.findMany({
        where: {
          voluntary,
          date,
        },
        take:20,
        skip:(page - 1 ) * 20,
      });
    }
    
    return {"response": res, "count": count};
  }

  async getAllDonationsByCrowdfunding(page: number, crowdfunding: number, date: string = undefined) {
    let res;
    let count = await this.prisma.donationHistory.count({where: {crowdfunding, date}});

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
          date,
        },
        take:20,
        skip:(page - 1 ) * 20,
      });
    }
    
    return {"response": res, "count": count};
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
