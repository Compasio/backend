import { Controller, Get, Post, Body, Patch, Param, Request } from '@nestjs/common';
import { CrowdfundingsService } from './crowdfundings.service';
import { CreateCrowdfundingDto } from './dto/create-crowdfunding.dto';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { AuthService } from 'src/auth/auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@Controller('crowdfundings')
@ApiBearerAuth()
@ApiTags('Crowdfundings')
export class CrowdfundingsController {
  constructor(
    private readonly crowdfundingsService: CrowdfundingsService,
    private authService: AuthService,
  ) {}

  @UserTypeAuth('admin', 'ong', 'ongAssociated')
  @Post('createCrowdfunding')
  @ApiCreatedResponse({description: 'Vaquinha criada com sucesso', type: CreateCrowdfundingDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiConflictResponse({ description: 'vaquinha já existente', status: 409})
  @ApiOperation({summary: 'Cria uma vaquinha'})
  async createCrowdfunding(@Body() createCrowdfundingDto: CreateCrowdfundingDto, @Request() req) {
    let proj = createCrowdfundingDto.project;
    let checkProjectOwner = await this.authService.checkProjectOwnershipForCrowdfunding(req, null, proj);
    return this.crowdfundingsService.createCrowdfunding(createCrowdfundingDto);
  }

  @Public()
  @Get('getCrowdfundingByProject/:project')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'project', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma de vaquinhas por projetos'})
  async getCrowdfundingByProject(@Param('project') project: number) {
    return this.crowdfundingsService.getCrowdfundingByProject(project);
  }

  @UserTypeAuth('admin', 'ong', 'ongAssociated')
  @Get('getCrowdfundingById/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma vaquinha pelo seu id'})
  async getCrowdfundingById(@Param('id') id: number) {
    return this.crowdfundingsService.getCrowdfundingById(id);
  }

  @Public()
  @Get('getCrowdfundingsByTitle/:title')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'title', schema: { default: 'Ajuda nacional' } })
  @ApiOperation({summary: 'Retorna uma lista de vaquinhas pelo nome'})
  async getCrowdfundingsByTitle(@Param('title') title: string) {
    return this.crowdfundingsService.getCrowdfundingsByTitle(title);
  }

  @UserTypeAuth('admin', 'ong', 'ongAssociated')
  @Patch('updateCrowdfundingNeededValue/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Atualiza valor necessario da vaquinha com o respectivo id'})
  async updateCrowdfundingNeededValue(@Param('id') id: number, @Body() newValue: number, @Request() req) {
    let checkProjectOwner = await this.authService.checkProjectOwnershipForCrowdfunding(req, id=id);
    return this.crowdfundingsService.updateCrowdfundingNeededValue(id, newValue);
  }

  @UserTypeAuth('admin', 'ong', 'ongAssociated')
  @Patch('closeCrowdfunding/:id')
  @ApiOkResponse({description: 'Requisição feita com sucesso', status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Fecha vaquinha com o respectivo id'})
  async closeCrowdfunding(@Param('id') id: number) {
    return this.crowdfundingsService.closeCrowdfunding(id);
  }

}
