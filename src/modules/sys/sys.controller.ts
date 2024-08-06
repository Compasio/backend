import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SysService } from './sys.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Public } from 'src/auth/decorators/public.decorator';
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

//TODAS AS ROTAS TEM QUE SER TRANCADAS APENAS PARA ADMINS

@Controller('sys')
@ApiBearerAuth()
@ApiTags('Sys')
export class SysController {
  constructor(private readonly sysService: SysService) {}

  @UserTypeAuth('admin')
  @Post('/createAdmin')
  @ApiCreatedResponse({description: 'Admin criado com sucesso', type: CreateAdminDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiNotAcceptableResponse({description: 'Senha não é forte o suficiente', status: 406})
  @ApiConflictResponse({ description: 'admin já existente', status: 409})
  @ApiOperation({summary: 'Cria um admin'})
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.sysService.createAdmin(createAdminDto);
  }

  @Public()
  @Get('/getVoluntaryHabilities')
  @ApiOperation({summary: 'Retornar enum de habilidades de usuários'})
  async getVoluntaryHabilities() {
    return this.sysService.getVoluntaryHabilities();
  }

  @Get()
  findAll() {
    return this.sysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sysService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sysService.remove(+id);
  }
}
