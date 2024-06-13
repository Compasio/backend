import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
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


@Controller('voluntary-relations')
@ApiBearerAuth()
@ApiTags('voluntary-Relations')
export class VoluntaryRelationsController {
  constructor(
    private readonly voluntaryRelationsService: VoluntaryRelationsService,
    private authService: AuthService,
  ) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatevoluntaryRelationDto: UpdateVoluntaryRelationDto) {
    return this.voluntaryRelationsService.update(+id, updatevoluntaryRelationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voluntaryRelationsService.remove(+id);
  }
}
