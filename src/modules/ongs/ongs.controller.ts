import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { OngsService } from './ongs.service';
import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Themes_ONG } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SearchThemeDto } from "./dto/search-theme.dto";

@Controller('ongs')
@ApiBearerAuth()
@ApiTags('Ong')
export class OngsController {
  constructor(
    private readonly ongsService: OngsService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('createOng')
  @ApiCreatedResponse({description: 'Ong criada com sucesso', type: CreateOngDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiNotAcceptableResponse({description: 'Senha não é forte o suficiente', status: 406})
  @ApiConflictResponse({ description: 'Ong já existente', status: 409})
  @ApiOperation({summary: 'Cria uma Ong'})
  @UseInterceptors(FileInterceptor('file'))
  async createOng(@Body() createOngDto: CreateOngDto, @UploadedFile() profilepic?: Express.Multer.File) {
    return await this.ongsService.createOng(createOngDto, profilepic);
  }

  @Public()
  @Get('getAllOngs/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de oito ongs por página'})
  async getAllOngs(@Param('page') page: number) {
    return await this.ongsService.getAllOngs(page);
  }

  @Public()
  @Get('getOngById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma ong pelo seu id'})
  async getOngById(@Param('id') id: string) {
    return await this.ongsService.getOngById(+id);
  }

  @Public()
  @Get('getOngByName/:name')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'name', schema: { default: 'João' } })
  @ApiOperation({summary: 'Retorna uma lista de ongs pelo nome'})
  async getOngByName(@Param('name') name: string) {
    return await this.ongsService.getOngByName(name)
  }

  @Public()
  @Post('getOngByTheme')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Retorna uma lista de ongs pelos temas'})
  async getOngsByTheme(@Body() dto: SearchThemeDto) {
    return await this.ongsService.getOngsByTheme(dto)
  }

  @UserTypeAuth('admin', 'ong')
  @Patch('updateOng/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', type: UpdateOngDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Atualiza informações da ong com o respectivo id'})
  async updateOng(@Param('id') id: number, @Body() updateOngDto: UpdateOngDto, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(id, req);
    return await this.ongsService.updateOng(+id, updateOngDto);
  }

  @UserTypeAuth('admin', 'ong')
  @Delete('removeOng/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Remove ong com o respectivo id'})
  async removeOng(@Param('id') id: number, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(id, req);
    return this.ongsService.removeOng(+id);
  }
}
