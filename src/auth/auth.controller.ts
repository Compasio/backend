import {
    Body,
    Controller,
    Get,
    Param,
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
    ApiParam,
    ApiTags,
  } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LogUserDto } from './log.user.dto';
import { PrismaService } from 'src/db/prisma.service';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';
import { EmailAuthService } from './emailAuth/emailAuth.service';
import { CodeDto } from "./emailAuth/code-dto";

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
      private authService: AuthService,
      private prisma: PrismaService,
      private emailAuthService: EmailAuthService,
    ) {}

    @Public()
    @Post('loginUser')
    @ApiOkResponse({description: 'Login realizado com sucesso', type: LogUserDto, status: 200})
    @ApiOperation({summary: 'Recebe o token de login'})
    async signInUser(@Body() logUserDto: LogUserDto) {
        return this.authService.signIn(logUserDto.email, logUserDto.password);
    }

    @Public()
    @Post('verifyUserCreation')
    @ApiCreatedResponse({description: 'Usuário criado com sucesso', status: 201})
    @ApiBadRequestResponse({ description: 'Requisição inválida', status: 400})
    @ApiConflictResponse({ description: 'Codigo inválido', status: 409})
    @ApiOperation({summary: 'Registra o voluntário depois de código mandado por email'})
    async verifyUserCreation(@Body() code: CodeDto) {
      return await this.emailAuthService.verifyUserCreation(code);
    }

    @UserTypeAuth('admin', 'voluntary', 'ong', 'ongAssociated')
    @Get('profile')
    @ApiOkResponse({description: 'Informação encontrada', type: LogUserDto, status: 200})
    @ApiOperation({summary: 'Retorna o perfil que está logado no momento'})
    async getProfile(@Request() req) {
        return await this.authService.getProfile(req);
    }
}
