import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../../auth/public.decorator';
import { Habilities_User } from '@prisma/client';
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

@Controller('users')
@ApiBearerAuth()
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('createUser')
  @ApiCreatedResponse({description: 'Usuário criado com sucesso', type: CreateUserDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiNotAcceptableResponse({description: 'Senha não é forte o suficiente', status: 406})
  @ApiConflictResponse({ description: 'Usuário já existente', status: 409})
  @ApiOperation({summary: 'Cria um usuário'})
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('/getAllUsers/:page')
  @ApiCreatedResponse({description: 'Requisição feita com sucesso', type: CreateUserDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'page', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna uma lista de vinte usuários por página'})
  async getAllUsers(@Param('page') page: number) {
    return this.usersService.getAllUsers(page);
  }

  @Get('/getUserById/:id')
  @ApiCreatedResponse({description: 'Requisição feita com sucesso', type: CreateUserDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Retorna um usuário pelo seu id'})
  async getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(+id);
  }

  @Get('/getUserByName/:name')
  async getUserByName(@Param('name') name: string) {
    return this.usersService.getUserById(+name);
  }

  @Get('/getUserByHabilities/:hability')
  async getUserByHabilities(@Param('hability') hability: string[]) {
    return this.usersService.getUserByHabilities(hability);
  }

  @Patch('/updateUser/:id')
  @ApiCreatedResponse({description: 'Requisição feita com sucesso', type: CreateUserDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Atualiza informações do usuário com o respectivo id'})
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete('/removeUser/:id')
  @ApiCreatedResponse({description: 'Requisição feita com sucesso', type: CreateUserDto, status: 201})
  @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
  @ApiParam({ name: 'id', schema: { default: 1 } })
  @ApiOperation({summary: 'Remove usuário com o respectivo id'})
  async removeUser(@Param('id') id: number) {
    return this.usersService.removeUser(+id);
  }
}
