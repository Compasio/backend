import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { OngAssociatedService } from './ong-associated.service';
import { CreateOngAssociatedDto } from './dto/create-ong-associated.dto';
import { UpdateOngAssociatedDto } from './dto/update-ong-associated.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Permissions } from '@prisma/client';
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
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import { AuthService } from 'src/auth/auth.service';

@Controller('ong-associated')
@ApiBearerAuth()
@ApiTags('Ong-Associates')
export class OngAssociatedController {
  constructor(
    private readonly ongAssociatedService: OngAssociatedService,
    private authService: AuthService,
  ) {}

  @UserTypeAuth('admin', 'ong')
  @ApiCreatedResponse({description: 'Associado criado com sucesso', type: CreateOngAssociatedDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiNotAcceptableResponse({description: 'Senha não é forte o suficiente', status: 406})
  @ApiConflictResponse({ description: 'Associado já existente', status: 409})
  @ApiOperation({summary: 'Cria um associado'})
  @Post('/createOngAssociate/:ongid')
  async createOngAssociate(@Body() createOngAssociatedDto: CreateOngAssociatedDto, @Param('ongid') ongid: number, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(ongid, req);
    return this.ongAssociatedService.createOngAssociate(createOngAssociatedDto, ongid);
  }

  @UserTypeAuth('admin', 'ong')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte associados da ong por página'})
  @Get('/getOngAssociatesByOng/:page/:ongid')
  async getOngAssociatesByOng(@Param('page') page: number, @Param('ongid') ongid: number, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(ongid, req);
    return this.ongAssociatedService.getOngAssociatesByOng(page, ongid);
  }

  @UserTypeAuth('admin', 'ong')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna um associado pelo seu id'})
  @Get('/getOngAssociateById/:id')
  async getOngAssociateById(@Param('id') id: string) {
    return this.ongAssociatedService.getOngAssociateById(+id);
  }

  @UserTypeAuth('admin', 'ong')
  @Post('/getOngAssociatesByPermission/:ongid/:permission')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Retorna uma lista de associados pelas permissões'})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  async getOngAssociatesByPermission(@Param('page') page: number, @Param('ongid') ongid: number, @Body() permission: Permissions[], @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(ongid, req);
    return await this.ongAssociatedService.getOngAssociatesByPermission(page, permission, ongid);
  }
  
  @UserTypeAuth('admin', 'ong')
  @Patch('/updateOngAssociate/:id/:ongid')
  @ApiOkResponse({description: 'Requisição feita com sucesso', type: UpdateOngAssociatedDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Atualiza informações do associado com o respectivo id'})
  async updateOngAssociate(@Param('id') id: number, @Param('ongid') ongid: number, @Body() updateOngAssociatedDto: UpdateOngAssociatedDto, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(ongid, req);
    return this.ongAssociatedService.updateOngAssociate(+id, ongid, updateOngAssociatedDto);
  }

  @UserTypeAuth('admin', 'ong')
  @Delete('/removeOngAssociate/:id/:ongid')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Remove associado com o respectivo id'})
  async removeOngAssociate(@Param('id') id: number, @Param('ongid') ongid: number, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(ongid, req);
    return this.ongAssociatedService.removeOngAssociate(+id, ongid);
  }
}
