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
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LogUserDto } from './log.user.dto';
import { PrismaService } from 'src/db/prisma.service';
import { UserTypeAuth } from 'src/auth/decorators/userTypeAuth.decorator';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
      private authService: AuthService,
      private prisma: PrismaService
    ) {}

    @Public()
    @Post('/loginUser')
    @ApiOkResponse({description: 'Login realizado com sucesso', type: LogUserDto, status: 200})
    @ApiOperation({summary: 'Recebe o token de login'})
    async signInUser(@Body() logUserDto: LogUserDto) {
        return this.authService.signIn(logUserDto.email, logUserDto.password);
    }

    @UserTypeAuth('admin', 'voluntier', 'ong', 'ongAssociate')
    @Get('/profile')
    @ApiOkResponse({description: 'Informação encontrada', type: LogUserDto, status: 200})
    @ApiOperation({summary: 'Retorna o perfil que está logado no momento'})
    async getProfile(@Request() req) {
        const user = {id: req.user.id,};
        const account = await this.prisma.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            voluntier: true,
            ong: true,
            ongAssociated: true,
          }
        });

        if(account.voluntier == null) delete account.voluntier;
        if(account.ong == null) delete account.ong;
        if(account.ongAssociated == null) delete account.ongAssociated;
        delete account.password;

        return account;
    }
}
