import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateVoluntaryRelationDto } from './dto/create-voluntary-relation.dto';
import { UpdateVoluntaryRelationDto } from './dto/update-voluntary-relation.dto';
import { Public } from '../../auth/decorators/public.decorator';
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
  constructor(private readonly voluntaryRelationsService: VoluntaryRelationsService) {}

  @Post()
  create(@Body() createvoluntaryRelationDto: CreateVoluntaryRelationDto) {
    return this.voluntaryRelationsService.create(createvoluntaryRelationDto);
  }

  @Get()
  findAll() {
    return this.voluntaryRelationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voluntaryRelationsService.findOne(+id);
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
