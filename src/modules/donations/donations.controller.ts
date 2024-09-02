import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../../auth/auth.service';

@Controller('donations')
@ApiBearerAuth()
@ApiTags('Donations')
export class DonationsController {
  constructor(
    private readonly donationsService: DonationsService,
    private authService: AuthService,
  ) {}

  @UserTypeAuth('admin', 'voluntary')
  @Post('createDonation')
  @ApiCreatedResponse({description: 'Doação resgistrada', type: CreateDonationDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Doação'})
  async createDonation(@Body() createDonationDto: CreateDonationDto, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(createDonationDto.voluntary, req);
    return await this.donationsService.createDonation(createDonationDto);
  }

  @UserTypeAuth('admin', 'ong')
  @Get('getAllDonationsByOng/:page/:ong/:date')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiParam({ name: 'ong', schema: { default: 1 } })
  @ApiParam({ name: 'date', schema: { default: '' } })
  @ApiOperation({summary: 'Retorna doações para cada ong'})
  async getAllDonationsByOng(@Param('page') page: number, @Param('ong') ong: number, @Param('date') date: string, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(ong, req);
    return await this.donationsService.getAllDonationsByOng(page, ong, date);
  }

  @UserTypeAuth('admin', 'voluntary')
  @Get('getAllDonationsByVoluntary/:page/:voluntary/:date')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiParam({ name: 'voluntary', schema: { default: 1 } })
  @ApiParam({ name: 'date', schema: { default: '' } })
  @ApiOperation({summary: 'Retorna doações para cada voluntário'})
  async getAllDonationsByVoluntary(@Param('page') page: number, @Param('voluntary') voluntary: number, @Param('date') date: string, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(voluntary, req);
    return await this.donationsService.getAllDonationsByVoluntary(page, voluntary, date);
  }

  @UserTypeAuth('admin', 'ong', 'ongAssociated')
  @Get('getAllDonationsByCrowdfunding/:page/:crowdfunding/:date')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiParam({ name: 'crowdfunding', schema: { default: 1 } })
  @ApiParam({ name: 'date', schema: { default: '' } })
  @ApiOperation({summary: 'Retorna doações para cada vaquinha'})
  async getAllDonationsByCrowdfunding(@Param('page') page: number, @Param('crowdfunding') crowdfunding: number, @Param('date') date: string, @Request() req) {
    let checkProjectOwner = await this.authService.checkProjectOwnershipForCrowdfunding(req, crowdfunding);
    return await this.donationsService.getAllDonationsByCrowdfunding(page, crowdfunding, date);
  }

  @UserTypeAuth('admin', 'voluntary', 'ong')
  @Get('getDonationById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma doação pelo seu id'})
  async getDonationById(@Param('id') id: number) {
    return await this.donationsService.getDonationById(id);
  }

}
