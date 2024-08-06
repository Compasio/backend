import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrowdfundingsService } from './crowdfundings.service';
import { CreateCrowdfundingDto } from './dto/create-crowdfunding.dto';
import { UpdateCrowdfundingDto } from './dto/update-crowdfunding.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

//Crowdfundings
@Controller('crowdfundings')
@ApiBearerAuth()
@ApiTags('Crowdfundings')
export class CrowdfundingsController {
  constructor(private readonly crowdfundingsService: CrowdfundingsService) {}

  @Post()
  create(@Body() createCrowdfundingDto: CreateCrowdfundingDto) {
    return this.crowdfundingsService.create(createCrowdfundingDto);
  }

  @Get()
  findAll() {
    return this.crowdfundingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crowdfundingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCrowdfundingDto: UpdateCrowdfundingDto) {
    return this.crowdfundingsService.update(+id, updateCrowdfundingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crowdfundingsService.remove(+id);
  }
}
