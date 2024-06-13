import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { PrismaService } from 'src/db/prisma.service';
import { CreateVoluntaryDto } from '../voluntary/dto/create-voluntary.dto';
import { Donation } from './entities/donation.entity';


@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async create(createDonationDto: CreateDonationDto){
    const {voluntary} = createDonationDto
    const voluntaryExist = await this.prisma.voluntary.findFirst({
      where:{
        id_voluntary:voluntary
      }
    })
    if(!voluntaryExist) throw new ConflictException("ERROR: Esse voluntario não existe")
      return this.prisma.donationHistory.create({
    data:{
      ...createDonationDto
    }
  
  })
  }

  async findAll(page: number) {
   let res
   if(page == 0){
    res = await this.prisma.donationHistory.findMany({})

   }else if (page == 1){
    res = await this.prisma.donationHistory.findMany({take:20})
   }
   
   else{
    res = await this.prisma.project.findMany({take:20,skip:(page - 1 ) * 20,})
   } return res
  }

  async findOne(id: number) {
    const donation = await this.prisma.donationHistory.findUnique({
      where:{
        id_donation: id,
      },
    });
    if(!donation) throw new NotFoundException("ERROR:Doação não encontrada")
  }

  async update(id: number, updateDonationDto: UpdateDonationDto) {
   const donation = await this.prisma.donationHistory.findUnique({
    where :{
      id_donation: id,
    },
   });
   if(!donation) throw new NotFoundException("Doação não encontrada");
   return this.prisma.donationHistory.update({
    data: {
      ...updateDonationDto,
    },
    where:{
      id_donation: id,
    }
   });
  }

  async remove(id: number) {
    const donation = await this.prisma.donationHistory.findUnique({
      where:{
        id_donation: id,
      },
    });
    if(!donation)throw new ConflictException("ERROR:Doação não encontrada")
      return this.prisma.donationHistory.delete({
    where: {
      id_donation: id,
    },
    });
  }
}
