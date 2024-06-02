import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MapsService } from './maps.service';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import { AuthService } from 'src/auth/auth.service';
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

@Controller('maps')
@ApiBearerAuth()
@ApiTags('Maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Public()
  @Post('/registerAddress/:id')
  @ApiCreatedResponse({description: 'Endereço requisitado com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiOperation({summary: 'Registrar endereço'})
  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  create(@Param('id') id: number, @Body() createMapDto: CreateMapDto) {
    return this.mapsService.registerAddress(id, createMapDto);
  }

  @Get()
  findAll() {
    return this.mapsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mapsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMapDto: UpdateMapDto) {
    return this.mapsService.update(+id, updateMapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mapsService.remove(+id);
  }
}
