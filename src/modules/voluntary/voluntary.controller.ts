import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VoluntaryService } from './voluntary.service';
import { CreateVoluntaryDto } from './dto/create-voluntary.dto';
import { UpdateVoluntaryDto } from './dto/update-voluntary.dto';
import { Public } from '../../auth/decorators/public.decorator';
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
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SearchHabilityDto } from "./dto/search-hability.dto";

@Controller('voluntarys')
@ApiBearerAuth()
@ApiTags('Voluntary')
export class VoluntarysController {
  constructor(
    private readonly voluntarysService: VoluntaryService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('createVoluntary')
  @ApiCreatedResponse({description: 'Voluntário criado com sucesso', type: CreateVoluntaryDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiNotAcceptableResponse({description: 'Senha não é forte o suficiente', status: 406})
  @ApiConflictResponse({ description: 'voluntário já existente', status: 409})
  @ApiOperation({summary: 'Cria um voluntário'})
  @UseInterceptors(FileInterceptor('file'))
  async createVoluntary(@Body() createvoluntaryDto: CreateVoluntaryDto, @UploadedFile() profilepic?: Express.Multer.File) {
    return await this.voluntarysService.createVoluntary(createvoluntaryDto, profilepic);
  }

  @Public()
  @Get('getAllVoluntarys/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de oito voluntários por página'})
  async getAllvoluntarys(@Param('page') page: number) {
    return await this.voluntarysService.getAllVoluntarys(page);
  }

  @Public()
  @Get('getVoluntaryById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna um voluntário pelo seu id'})
  async getvoluntaryById(@Param('id') id: number) {
    return await this.voluntarysService.getVoluntaryById(+id);
  }

  @Public()
  @Get('getVoluntarysByName/:name')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'name', schema: { default: 'João' } })
  @ApiOperation({summary: 'Retorna uma lista de voluntários pelo nome'})
  async getvoluntarysByName(@Param('name') name: string) {
    return await this.voluntarysService.getVoluntarysByName(name);
  }

  @Public()
  @Post('getVoluntarysByHabilities')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Retorna uma lista de voluntários pelas habilidades'})
  async getvoluntarysByHabilities(@Body() dto: SearchHabilityDto) {
    return await this.voluntarysService.getVoluntarysByHabilities(dto);
  }

  @UserTypeAuth('admin', 'voluntary')
  @Patch('updateVoluntary/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', type: UpdateVoluntaryDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Atualiza informações do voluntário com o respectivo id'})
  @UseInterceptors(FileInterceptor('file'))
  async updatevoluntary(@Param('id') id: number, @Body() updatevoluntaryDto: UpdateVoluntaryDto, @Request() req, @UploadedFile() profilepic?: Express.Multer.File) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(id, req);
    return await this.voluntarysService.updateVoluntary(id, updatevoluntaryDto, profilepic);
  }

  @UserTypeAuth('admin', 'voluntary')
  @Delete('removeVoluntary/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Remove voluntário com o respectivo id'})
  async removevoluntary(@Param('id') id: number, @Request() req) {
    let confirmPass = await this.authService.checkIdAndAdminStatus(id, req);
    return await this.voluntarysService.removeVoluntary(+id);
  }
}
