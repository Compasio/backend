import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('donations')
@ApiBearerAuth()
@ApiTags('Donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @UserTypeAuth('admin', 'voluntary')
  @Post('/createDonation')
  @ApiCreatedResponse({description: 'Doação resgistrada', type: CreateDonationDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Doação'})
  async createDonation(@Body() createDonationDto: CreateDonationDto) {
    return await this.donationsService.createDonation(createDonationDto);
  }

  @UserTypeAuth('admin', 'voluntary')
  @Get('/getAllDonationsByOng/:page/:ong/:date')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiParam({ name: 'ong', schema: { default: 1 } })
  @ApiParam({ name: 'date', schema: { default: undefined } })
  @ApiOperation({summary: 'Retorna doações para cada ong'})
  async getAllDonationsByOng(@Param('page') page: number, @Param('ong') ong: number, @Param('date') date: string) {
    return await this.donationsService.getAllDonationsByOng(page, ong, date);
  }

  @UserTypeAuth('admin', 'voluntary')
  @Get('/getAllDonationsByVoluntary/:page/:voluntary/:date')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiParam({ name: 'voluntary', schema: { default: 1 } })
  @ApiParam({ name: 'date', schema: { default: undefined } })
  @ApiOperation({summary: 'Retorna doações para cada voluntário'})
  async getAllDonationsByVoluntary(@Param('page') page: number, @Param('voluntary') voluntary: number, @Param('date') date: string) {
    return await this.donationsService.getAllDonationsByVoluntary(page, voluntary, date);
  }

  @UserTypeAuth('admin', 'voluntary')
  @Get('/getAllDonationsByCrowdfunding/:page/:crowdfunding/:date')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiParam({ name: 'crowdfunding', schema: { default: 1 } })
  @ApiParam({ name: 'date', schema: { default: undefined } })
  @ApiOperation({summary: 'Retorna doações para cada vaquinha'})
  async getAllDonationsByCrowdfunding(@Param('page') page: number, @Param('voluntary') voluntary: number, @Param('date') date: string) {
    return await this.donationsService.getAllDonationsByVoluntary(page, voluntary, date);
  }

  @UserTypeAuth('admin', 'voluntary')
  @Get('/getDonationById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma doação pelo seu id'})
  async getDonationById(@Param('id') id: number) {
    return await this.donationsService.getDonationById(id);
  }

}
