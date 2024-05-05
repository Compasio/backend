import {
    Body,
    Controller,
    Get,
    Post,
    Request,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
import { UsersService } from '../modules/users/users.service';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LogUserDto } from './log.user.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) {}

    @Public()
    @Post('auth/loginUser')
    @ApiOkResponse({description: 'Login realizado com sucesso', type: LogUserDto, status: 200})
    @ApiOperation({summary: 'Recebe o token de login'})
    async signInUser(@Body() logUserDto: LogUserDto) {
        return this.authService.signInUser(logUserDto.email, logUserDto.password);
    }

    //TODO---FAZER ROTAS AUTH PARA AS ONGS E PARA OS ASSOCIADOS DA ONG

    @Get('auth/profile')
    @ApiOkResponse({description: 'Informação encontrada', type: LogUserDto, status: 200})
    @ApiOperation({summary: 'Retorna o perfil que está logado no momento'})
    async getProfile(@Request() req) {
        const user = {id: req.user.id,};
        return await this.usersService.getUserById(user.id);
    }
}
