import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OngAssociatedService } from './ong-associated.service';
import { CreateOngAssociatedDto } from './dto/create-ong-associated.dto';
import { UpdateOngAssociatedDto } from './dto/update-ong-associated.dto';

@Controller('ong-associated')
export class OngAssociatedController {
  constructor(private readonly ongAssociatedService: OngAssociatedService) {}

  @Post()
  create(@Body() createOngAssociatedDto: CreateOngAssociatedDto) {
    return this.ongAssociatedService.create(createOngAssociatedDto);
  }

  @Get()
  findAll() {
    return this.ongAssociatedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ongAssociatedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOngAssociatedDto: UpdateOngAssociatedDto) {
    return this.ongAssociatedService.update(+id, updateOngAssociatedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ongAssociatedService.remove(+id);
  }
}
