import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AuthService {
    constructor(
      private jwtService: JwtService,
      private prisma: PrismaService,
    ) {}
  
    async signIn(email: string, password: string) {
      const user = await this.getUserByEmail(email);
      if(!user) throw new UnauthorizedException('Usuário não existe');
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (isMatch) {
        const payload = { id: user.id, email: user.email, userType: user.userType };
        return await this.jwtService.signAsync(payload);
      } else {
        throw new UnauthorizedException('Senha incorreta');
      }
    }

    async getUserByEmail(email: string) {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if(!user) throw new NotFoundException('ERROR: Voluntário não encontrado');
      return user;
  }

}
