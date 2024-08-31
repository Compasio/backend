import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { MapsService } from './maps.service';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import { AuthService } from 'src/auth/auth.service';
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

@Controller('maps')
@ApiBearerAuth()
@ApiTags('Maps')
export class MapsController {
  constructor(
    private readonly mapsService: MapsService,
    private authService: AuthService,
    ) {}

  @UserTypeAuth('admin', 'ong')
  @Post('registerAddress')
  @ApiCreatedResponse({description: 'Endereço requisitado com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Registrar endereço'})
  async registerAddress(@Body() createMapDto: CreateMapDto, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(createMapDto.id_user, req);
    return this.mapsService.registerAddress(createMapDto.id_user, createMapDto);
  }

  @Public()
  @Get('getAllAddress/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte endereços por página'})
  async getAllAddress(@Param('page') page: number) {
    return this.mapsService.getAllAddress(page);
  }

  @Public()
  @Get('getAddressFromOng/:ongname')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'ongname', schema: { default: "example" } })
  @ApiOperation({summary: 'Retorna lista de endereçõs com ongs que correspondem ao input'})
  async getAddressFromOng(@Param('ongname') ongname: string) {
    return this.mapsService.getAddressFromOng(ongname);
  }

  @Public()
  @Get('getOngsByPlace/:place')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'place', schema: { default: "36 Avenida Paulista" } })
  @ApiOperation({summary: 'Retorna uma lista de 30 ongs correspondentes'})
  async getOngsByPlace(@Param('place') place: string) {
    return this.mapsService.getOngsByPlace(place);
  }

  @Public()
  @Get('getNearestOgns/:userLat/:userLng/:radius')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'userLat', schema: { default: -23.571101 } })
  @ApiParam({ name: 'userLng', schema: { default: -46.644646 } })
  @ApiParam({ name: 'radius', schema: { default: 10 } })
  @ApiOperation({summary: 'Retorna uma lista de 30 ongs correspondentes'})
  async getNearestOgns(@Param('userLat') userLat: number, @Param('userLng') userLng: number, @Param('radius') radius: number) {
    return this.mapsService.getNearestOgns(userLat, userLng, radius);
  }

  @UserTypeAuth('admin', 'voluntary', 'ong', 'ongAssociated')
  @Get('getAddressById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna um endereço pelo id do usuário'})
  async getAddressById(@Param('id') id: number) {
    return await this.mapsService.getAddressById(+id);
  }

  @UserTypeAuth('admin', 'ong')
  @Patch('updateAddress/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', type: UpdateMapDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Atualiza informações do endereço com o respectivo id'})
  async updatevoluntary(@Param('id') id: number, @Body() updatemapDto: UpdateMapDto, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(id, req);
    return await this.mapsService.updateAddress(id, updatemapDto);
  }

  @UserTypeAuth('admin', 'ong')
  @Delete('deleteAddress/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Remove endereço com o respectivo id'})
  async deleteAddress(@Param('id') id: number, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(id, req);
    return await this.mapsService.deleteAddress(+id);
  }
}
