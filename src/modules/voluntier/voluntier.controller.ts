import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { VoluntierService } from './voluntier.service';
import { CreateVoluntierDto } from './dto/create-voluntier.dto';
import { UpdateVoluntierDto } from './dto/update-voluntier.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Habilities_User } from '@prisma/client';
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

@Controller('voluntiers')
@ApiBearerAuth()
@ApiTags('Voluntier')
export class VoluntiersController {
  constructor(
    private readonly VoluntiersService: VoluntierService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('/createVoluntier')
  @ApiCreatedResponse({description: 'Voluntário criado com sucesso', type: CreateVoluntierDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiNotAcceptableResponse({description: 'Senha não é forte o suficiente', status: 406})
  @ApiConflictResponse({ description: 'voluntário já existente', status: 409})
  @ApiOperation({summary: 'Cria um voluntário'})
  async createVoluntier(@Body() createVoluntierDto: CreateVoluntierDto) {
    return await this.VoluntiersService.createVoluntier(createVoluntierDto);
  }

  @Public()
  @Get('/getAllVoluntiers/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte voluntários por página'})
  async getAllVoluntiers(@Param('page') page: number) {
    return await this.VoluntiersService.getAllVoluntiers(page);
  }

  @UserTypeAuth('admin', 'voluntier')
  @Get('/getVoluntierById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna um voluntário pelo seu id'})
  async getVoluntierById(@Param('id') id: number) {
    return await this.VoluntiersService.getVoluntierById(+id);
  }

  @Public()
  @Get('/getVoluntiersByName/:name')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'name', schema: { default: 'João' } })
  @ApiOperation({summary: 'Retorna uma lista de voluntários pelo nome'})
  async getVoluntiersByName(@Param('name') name: string) {
    return await this.VoluntiersService.getVoluntiersByName(name);
  }

  @Public()
  @Post('/getVoluntiersByHabilities/:hability')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Retorna uma lista de voluntários pelas habilidades'})
  async getVoluntiersByHabilities(@Body() hability: Habilities_User[]) {
    return await this.VoluntiersService.getVoluntiersByHabilities(hability);
  }

  @UserTypeAuth('admin', 'voluntier')
  @Patch('/updateVoluntier/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', type: UpdateVoluntierDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Atualiza informações do voluntário com o respectivo id'})
  async updateVoluntier(@Param('id') id: number, @Body() updateVoluntierDto: UpdateVoluntierDto, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(id, req);
    return await this.VoluntiersService.updateVoluntier(+id, updateVoluntierDto);
  }

  @UserTypeAuth('admin', 'voluntier')
  @Delete('/removeVoluntier/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Remove voluntário com o respectivo id'})
  async removeVoluntier(@Param('id') id: number, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(id, req);
    return await this.VoluntiersService.removeVoluntier(+id);
  }
}
