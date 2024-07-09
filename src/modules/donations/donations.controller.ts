import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('donations')
@ApiBearerAuth()
@ApiTags('Donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post('/createDonation')
  async createDonation(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.createDonation(createDonationDto);
  }

  @Get()
  async getAllDonationsByOng(@Param('page') page: number) {
    return this.donationsService.getAllDonationsByOng();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationsService.update(+id, updateDonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationsService.remove(+id);
  }
}
