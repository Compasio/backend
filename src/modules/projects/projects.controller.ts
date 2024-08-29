import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth, ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateVoluntaryDto } from '../voluntary/dto/create-voluntary.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { UserTypeAuth } from '../../auth/decorators/userTypeAuth.decorator';

@Controller('projects')
@ApiBearerAuth()
@ApiTags('Projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Post('createProject')
  @ApiCreatedResponse({description: 'Projeto criado com sucesso', type: CreateVoluntaryDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiConflictResponse({ description: 'Projeto já existente', status: 409})
  @ApiOperation({summary: 'Cria um projeto'})
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Public()
  @Get('getAllProjectsByOng/:ong/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiParam({ name: 'ong', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte projetos por página por ong'})
  async getAllProjectsByOng(@Param('ong') ong: number, @Param('page') page: number) {
    return this.projectsService.getAllProjectsByOng(ong, page);
  }

  @Public()
  @Get('getAllProjects/:page')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte projetos por página'})
  async getAllProjects(@Param('page') page: number) {
    return this.projectsService.getAllProjects(page);
  }

  @Public()
  @Get('getProjectById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna um projeto pelo seu id'})
  async getProjectById(@Param('id') id: number) {
    return this.projectsService.getProjectById(id);
  }

  @Public()
  @Get('getProjectsByName/:name')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'name', schema: { default: '' } })
  @ApiOperation({summary: 'Retorna uma lista de vinte voluntários por página'})
  async getProjectsByName(@Param('name') name: string) {
    return this.projectsService.getProjectsByName(name);
  }

  @UserTypeAuth('admin', 'ong', 'ongAssociated')
  @Patch('updateProject/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Atualiza um projeto'})
  async updateProject(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  @UserTypeAuth('admin', 'ong', 'ongAssociated')
  @Delete('deleteProject/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Deleta um projeto e os crowdfundings atrelados'})
  async deleteProject(@Param('id') id: number) {
    return this.projectsService.deleteProject(id);
  }
}
