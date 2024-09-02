import {
    Body,
    Controller,
    Get,
    Post,
    Request,
  } from '@nestjs/common';
  import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LogUserDto } from './dto/log.user.dto';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import { CodeDto } from "./dto/code-dto";
import { PassCodeDto } from "./dto/pass-code-dto";
import { EmailDto } from "./dto/emai-dto";

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
      private authService: AuthService,
    ) {}

    @Public()
    @Post('loginUser')
    @ApiOkResponse({description: 'Login realizado com sucesso', type: LogUserDto, status: 200})
    @ApiOperation({summary: 'Recebe o token de login'})
    async signInUser(@Body() logUserDto: LogUserDto) {
        return this.authService.signIn(logUserDto.email, logUserDto.password);
    }

    @UserTypeAuth('admin', 'voluntary', 'ong', 'ongAssociated')
    @Post('logoutUser')
    @ApiOkResponse({description: 'Logout realizado com sucesso', status: 200})
    @ApiOperation({summary: 'Faz logout do usuário, esta rota coloca tokens usados ' +
        'por usuários que fizeram logout na blacklist, é preciso também deletar o token na' +
        'client side'})
    async singOut(@Request() req) {
      return this.authService.singOut(req.get('authorization'));
    }

    @Public()
    @Post('verifyUserCreation')
    @ApiCreatedResponse({description: 'Usuário criado com sucesso', status: 201})
    @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
    @ApiConflictResponse({ description: 'Codigo inválido', status: 409})
    @ApiOperation({summary: 'Registra o voluntário depois de código mandado por email'})
    async verifyUserCreation(@Body() code: CodeDto) {
      return await this.authService.verifyUserCreation(code);
    }

    @UserTypeAuth('admin', 'voluntary', 'ong', 'ongAssociated')
    @Get('profile')
    @ApiOkResponse({description: 'Informação encontrada', type: LogUserDto, status: 200})
    @ApiOperation({summary: 'Retorna o perfil que está logado no momento'})
    async getProfile(@Request() req) {
        return await this.authService.getProfile(req);
    }

    @Public()
    @Post('passwordRecovery')
    @ApiOkResponse({description: 'Realizado com sucesso', status: 200})
    @ApiOperation({summary: 'Cria código para recuperar senha'})
    async passwordRecoveryCode(@Body() logUserDto: EmailDto) {
      return this.authService.passwordRecoveryCode(logUserDto);
    }

    @Public()
    @Post('resetPassword')
    @ApiOkResponse({description: 'Senha resetada com sucesso', status: 200})
    @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
    @ApiConflictResponse({ description: 'Codigo inválido', status: 409})
    @ApiOperation({summary: 'Reseta a senha do voluntário a partir do código'})
    async resetPassword(@Body() code: PassCodeDto) {
      return await this.authService.resetPassword(code);
    }
}
