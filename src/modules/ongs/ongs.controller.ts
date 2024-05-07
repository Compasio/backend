import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OngsService } from './ongs.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { Public } from '../../auth/public.decorator';
import { Themes_ONG } from '@prisma/client';
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

@Controller('ongs')
@ApiBearerAuth()
@ApiTags('ONG')
export class OngsController {
  constructor(private readonly ongsService: OngsService) {}

  @Public()
  @Post('/createOng')
  @ApiCreatedResponse({description: 'Ong criada com sucesso', type: CreateOngDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiNotAcceptableResponse({description: 'Senha não é forte o suficiente', status: 406})
  @ApiConflictResponse({ description: 'Ong já existente', status: 409})
  @ApiOperation({summary: 'Cria uma Ong'})
  async createOng(@Body() createOngDto: CreateOngDto) {
    return await this.ongsService.createOng(createOngDto);
  }

  @Get('/getAllOngs/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte ongs por página'})
  async getAllOngs(@Param('page') page: number) {
    return await this.ongsService.getAllOngs(page);
  }

  @Get('/getOngById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma ong pelo seu id'})
  async getOngById(@Param('id') id: string) {
    return await this.ongsService.getOngById(+id);
  }

  @Get('/getOngByName/:name')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'name', schema: { default: 'João' } })
  @ApiOperation({summary: 'Retorna uma lista de ongs pelo nome'})
  async getOngByName(@Param('name') name: string) {
    return await this.ongsService.getOngByName(name)
  }

  @Post('/getOngByTheme/:theme')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Retorna uma lista de ongs pelos temas'})
  async getOngsByTheme(@Body() themes: Themes_ONG[]) {
    return await this.ongsService.getOngsByTheme(themes)
  }

  @Patch('/updateOng/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', type: UpdateOngDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Atualiza informações da ong com o respectivo id'})
  async updateOng(@Param('id') id: string, @Body() updateOngDto: UpdateOngDto) {
    return await this.ongsService.updateOng(+id, updateOngDto);
  }

  @Delete('/removeOng/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Remove ong com o respectivo id'})
  removeOng(@Param('id') id: string) {
    return this.ongsService.removeOng(+id);
  }
}
