import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateVoluntaryRelationDto } from './dto/create-voluntary-relation.dto';
import { UpdateVoluntaryRelationDto } from './dto/update-voluntary-relation.dto';
import { Public } from '../../auth/decorators/public.decorator';
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
import { VoluntaryRelationsService } from './voluntary-relations.service';
import { User } from '../voluntary/entities/user.entity';


@Controller('voluntary-relations')
@ApiBearerAuth()
@ApiTags('Voluntary-Relations')
export class VoluntaryRelationsController {
  constructor(private readonly voluntaryRelationsService: VoluntaryRelationsService) {}

  @UserTypeAuth('admin', 'voluntary', 'ong', 'ongAssociate')
  @Post('/createVoluntaryRelation')
  @ApiCreatedResponse({description: 'Voluntário criado com sucesso', type: CreateVoluntaryRelationDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiNotAcceptableResponse({description: 'Senha não é forte o suficiente', status: 406})
  @ApiConflictResponse({ description: 'voluntário já existente', status: 409})
  @ApiOperation({summary: 'Cria uma relação entre ong e voluntário'})
  async createVoluntaryRelation(@Body() createvoluntaryRelationDto: CreateVoluntaryRelationDto) {
    return this.voluntaryRelationsService.createVoluntaryRelation(createvoluntaryRelationDto);
  }

  @Public()
  @Get('/getAllRelationsByOng/:ong/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'ong', schema: { default: 1 } })
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte relações envolvendo a ong enviada por página'})
  async getAllRelationsByOng(@Param('ong') ong: number, @Param('page') page: number) {
    return this.voluntaryRelationsService.getAllRelationsByOng(ong, page);
  }

  @Public()
  @Get('/getAllRelationsByVoluntary/:voluntary/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'voluntary', schema: { default: 1 } })
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte relações envolvendo o voluntário enviado por página'})
  async getAllRelationsByVoluntary(@Param('voluntary') voluntary: number, @Param('page') page: number) {
    return this.voluntaryRelationsService.getAllRelationsByVoluntary(voluntary, page);
  }

  @UserTypeAuth('admin')
  @Get('/getVoluntaryRelationById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma relação pelo seu id'})
  async getVoluntaryRelationById(@Param('id') id: number) {
    return this.voluntaryRelationsService.getVoluntaryRelationById(id);
  }

  @UserTypeAuth('admin')
  @Patch('/updateVoluntaryRelation/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Update da relação (apenas pode ser feito por admin)'})
  async updateVoluntaryRelation(@Param('id') id: number, @Body() updatevoluntaryRelationDto: UpdateVoluntaryRelationDto) {
    return this.voluntaryRelationsService.updateVoluntaryRelation(+id, updatevoluntaryRelationDto);
  }

  @UserTypeAuth('admin')
  @Delete('/removeVoluntaryRelation/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Remover a relação (apenas pode ser feito por admin)'})
  async removeVoluntaryRelation(@Param('id') id: number) {
    return this.voluntaryRelationsService.removeVoluntaryRelation(+id);
  }
}
