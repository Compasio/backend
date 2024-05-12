import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VoluntierRelationsService } from './voluntier-relations.service';
import { CreateVoluntierRelationDto } from './dto/create-voluntier-relation.dto';
import { UpdateVoluntierRelationDto } from './dto/update-voluntier-relation.dto';
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


@Controller('voluntier-relations')
@ApiBearerAuth()
@ApiTags('Voluntier-Relations')
export class VoluntierRelationsController {
  constructor(private readonly voluntierRelationsService: VoluntierRelationsService) {}

  @Post()
  create(@Body() createVoluntierRelationDto: CreateVoluntierRelationDto) {
    return this.voluntierRelationsService.create(createVoluntierRelationDto);
  }

  @Get()
  findAll() {
    return this.voluntierRelationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voluntierRelationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoluntierRelationDto: UpdateVoluntierRelationDto) {
    return this.voluntierRelationsService.update(+id, updateVoluntierRelationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voluntierRelationsService.remove(+id);
  }
}
