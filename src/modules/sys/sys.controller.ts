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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import { UpdateVoluntaryDto } from '../voluntary/dto/update-voluntary.dto';
import { BlacklistDto } from './dto/blacklist-dto';

@Controller('sys')
@ApiBearerAuth()
@ApiTags('Sys')
export class SysController {
  constructor(private readonly sysService: SysService) {}

  @UserTypeAuth('admin')
  @Post('createAdmin')
  @ApiCreatedResponse({description: 'Admin criado com sucesso', type: CreateAdminDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiNotAcceptableResponse({description: 'Senha não é forte o suficiente', status: 406})
  @ApiConflictResponse({ description: 'admin já existente', status: 409})
  @ApiOperation({summary: 'Cria um admin'})
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.sysService.createAdmin(createAdminDto);
  }

  @Public()
  @Get('getVoluntaryHabilities')
  @ApiOperation({summary: 'Retornar enum de habilidades de usuários'})
  async getVoluntaryHabilities() {
    return this.sysService.getVoluntaryHabilities();
  }

  @Public()
  @Get('getOngThemes')
  @ApiOperation({summary: 'Retornar enum de temas de ong'})
  async getOngThemes() {
    return this.sysService.getOngThemes();
  }

  @UserTypeAuth('admin')
  @Post('addUserToBlackList')
  @ApiOkResponse({description: 'Requisição feita com sucesso', type: UpdateVoluntaryDto, status: 201})
  @ApiOperation({summary: 'Adiciona um usuário na blacklist'})
  async addUserToBlackList(@Body() blacklistDto: BlacklistDto) {
    return this.sysService.addUserToBlackList(blacklistDto.id);
  }

  @UserTypeAuth('admin')
  @Post('removeUserFromBlackList')
  @ApiOkResponse({description: 'Requisição feita com sucesso', type: UpdateVoluntaryDto, status: 201})
  @ApiOperation({summary: 'Adiciona um usuário na blacklist'})
  async removeUserFromBlackList(@Body() blacklistDto: BlacklistDto) {
    return this.sysService.removeUserFromBlackList(blacklistDto.id);
  }

  // @Get()
  // findAll() {
  //   return this.sysService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.sysService.findOne(+id);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.sysService.remove(+id);
  // }
}
