import {
  ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/db/prisma.service';
import { Permissions } from '@prisma/client';

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

  async checkIdAndAdminStatus(userid: number, req) {
    const userRequest = {id: req.user.id, userType: req.user.userType};
    if(userRequest.userType === 'admin') {
      return true;
    } else if(userid === userRequest.id) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }

  async checkIfOngAssociateIsFromOngAndItsPermission(ong: number, req, permissions: Permissions) {
    let id = req.user.id;
    const associate = await this.prisma.ongAssociated.findUnique({
      where: {
        id_associate: id,
        ong,
      },
    });

    if(!associate) throw new UnauthorizedException();

    let associatePermissions = associate.permissions;
    if(associatePermissions.includes(permissions) == false) throw new UnauthorizedException("ERROR: você não tem permissão para executar esta ação");
    
    return true;
  }
}
