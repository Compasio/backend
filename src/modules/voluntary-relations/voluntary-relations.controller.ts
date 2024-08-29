import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { CreateVoluntaryRelationDto } from './dto/create-voluntary-relation.dto';
import { UpdateVoluntaryRelationDto } from './dto/update-voluntary-relation.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import { AuthService } from 'src/auth/auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { VoluntaryRelationsService } from './voluntary-relations.service';
import { RequestRelationDto } from "./dto/request-relation.dto";


@Controller('voluntary-relations')
@ApiBearerAuth()
@ApiTags('Voluntary-Relations')
export class VoluntaryRelationsController {
  constructor(
    private readonly voluntaryRelationsService: VoluntaryRelationsService,
    private authService: AuthService,
  ) {}

  @UserTypeAuth('admin', 'ong', 'voluntary', 'ongAssociated')
  @Post('requestVoluntaryRelation')
  @ApiCreatedResponse({description: 'Relação requisitada com sucesso', status: 201, type: RequestRelationDto})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Requisita uma relação de voluntario'})
  async requestVoluntaryRelation(@Body() dto: RequestRelationDto, @Request() req) {
    let type = req.user.userType;
    if(type == 'ong') {
      let confirmPass = await this.authService.checkIdAndAdminStatus(dto.ong, req);
    } 
    else if(type == 'ongAssociated') {
      let confirmPass = await this.authService.checkIfOngAssociateIsFromOngAndItsPermission(dto.ong, req, 'voluntary');
    }
    else {
      let confirmPass = await this.authService.checkIdAndAdminStatus(dto.voluntary, req);
    }
    return this.voluntaryRelationsService.requestVoluntaryRelation(dto, type);
  }

  @UserTypeAuth('admin', 'ong', 'voluntary', 'ongAssociated')
  @Post('acceptVoluntaryRelation/:ong/:voluntary')
  @ApiCreatedResponse({description: 'Relação aceitada com sucesso', status: 201, type: CreateVoluntaryRelationDto})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Aceita uma relação de voluntario'})
  async acceptVoluntaryRelation(@Body() createvoluntaryRelationDto: CreateVoluntaryRelationDto, @Request() req) {
    let type = req.user.userType;
    if(type == 'ong') {
      let confirmPass = await this.authService.checkIdAndAdminStatus(createvoluntaryRelationDto.ong, req);
    } 
    else if(type == 'ongAssociated') {
      let confirmPass = await this.authService.checkIfOngAssociateIsFromOngAndItsPermission(createvoluntaryRelationDto.ong, req, 'voluntary');
    }
    else {
      let confirmPass = await this.authService.checkIdAndAdminStatus(createvoluntaryRelationDto.voluntary, req);
    }
    return this.voluntaryRelationsService.acceptVoluntaryRelation(createvoluntaryRelationDto, type);
  }

  @UserTypeAuth('admin', 'ong', 'voluntary', 'ongAssociated')
  @Delete('refuseVoluntaryRelation/:ong/:voluntary')
  @ApiCreatedResponse({description: 'Relação recusada com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Recusa uma relação de voluntario'})
  async refuseVoluntaryRelation(@Param('ong') ong: number, @Param('voluntary') voluntary: number, @Request() req) {
    let type = req.user.userType;
    if(type == 'ong') {
      let confirmPass = await this.authService.checkIdAndAdminStatus(ong, req);
    } 
    else if(type == 'ongAssociated') {
      let confirmPass = await this.authService.checkIfOngAssociateIsFromOngAndItsPermission(ong, req, 'voluntary');
    }
    else {
      let confirmPass = await this.authService.checkIdAndAdminStatus(voluntary, req);
    }
    return this.voluntaryRelationsService.refuseVoluntaryRelation(voluntary, ong);
  }

  @UserTypeAuth('admin', 'ong', 'ongAssociated')
  @Get('getAllRequestsByOng/:page/:ong')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'ong', schema: { default: 1 } })
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte requisições de relações envolvendo a ong enviada por página'})
  async getAllRequestsByOng(@Param('ong') ong: number, @Param('page') page: number) {
    return this.voluntaryRelationsService.getAllRequestsByOng(ong, page);
  }

  @UserTypeAuth('admin', 'voluntary')
  @Get('getAllRequestsByVoluntary/:voluntary/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'voluntary', schema: { default: 1 } })
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte requisições de relação envolvendo o voluntário enviado por página'})
  async getAllRequestsByVoluntary(@Param('voluntary') voluntary: number, @Param('page') page: number) {
    return this.voluntaryRelationsService.getAllRequestsByVoluntary(voluntary, page);
  }

  @Public()
  @Get('getAllRelationsByVoluntary/:voluntary/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'voluntary', schema: { default: 1 } })
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte relações envolvendo o voluntário enviado por página'})
  async getAllRelationsByVoluntary(@Param('voluntary') voluntary: number, @Param('page') page: number) {
    return this.voluntaryRelationsService.getAllRelationsByVoluntary(voluntary, page);
  }

  @Public()
  @Get('getAllRelationsByOng/:ong/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'ong', schema: { default: 1 } })
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte relações envolvendo a ong enviada por página'})
  async getAllRelationsByOng(@Param('ong') ong: number, @Param('page') page: number) {
    return this.voluntaryRelationsService.getAllRelationsByOng(ong, page);
  }

  @UserTypeAuth('admin', 'ong', 'ongAssociated')
  @Get('getAllRequestsByProject/:page/:project')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'project', schema: { default: 1 } })
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte relações envolvendo o projeto enviado por página'})
  async getAllRequestsByProject(@Param('page') page: number, @Param('project') project: number) {
    return this.voluntaryRelationsService.getAllRequestsByProject(page, project);
  }

  @Public()
  @Get('getAllRelationsByProject/:page/:project')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'project', schema: { default: 1 } })
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte relações envolvendo o projeto enviado por página'})
  async getAllRelationsByProject(@Param('page') page: number, @Param('project') project: number) {
    return this.voluntaryRelationsService.getAllRelationsByProject(page, project);
  }

  @UserTypeAuth('admin')
  @Get('getVoluntaryRelationById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma relação pelo seu id'})
  async getVoluntaryRelationById(@Param('id') id: number) {
    return this.voluntaryRelationsService.getVoluntaryRelationById(id);
  }

  @UserTypeAuth('admin')
  @Patch('updateVoluntaryRelation/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Update da relação (apenas pode ser feito por admin)'})
  async updateVoluntaryRelation(@Param('id') id: number, @Body() updatevoluntaryRelationDto: UpdateVoluntaryRelationDto) {
    return this.voluntaryRelationsService.updateVoluntaryRelation(+id, updatevoluntaryRelationDto);
  }

  @UserTypeAuth('admin')
  @Delete('removeVoluntaryRelation/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Remover a relação (apenas pode ser feito por admin)'})
  async removeVoluntaryRelation(@Param('id') id: number) {
    return this.voluntaryRelationsService.removeVoluntaryRelation(+id);
  }
}
