import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { PrismaService } from '../db/prisma.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private reflector: Reflector,
      private prisma: PrismaService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }
      
      const types = this.reflector.get<string[]>('userType', context.getHandler());
      if(!types) {
        throw new UnauthorizedException();
      }

      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }

      const checkTokenBlackList = await this.checkTokenBlackList(token);
      if(checkTokenBlackList) {
        throw new UnauthorizedException();
      }

      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWTSECRET,
        });

        const checkUserBlackList = await this.checkUserBlackList(payload.id)

        if(checkUserBlackList) {
          throw new UnauthorizedException();
        }

        const userRole = payload.userType;
        const match = this.matchUserTypeFromHeader(types, userRole);

        if(!match) {
          throw new UnauthorizedException();
        }

        request['user'] = payload;
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }

    private matchUserTypeFromHeader(types: string[], currentUserType: string) {
      return types.some((type) => type === currentUserType);
    }

    private async checkUserBlackList(id_user: number) {
      const check = await this.prisma.userBlackList.findUnique({
        where: {
          id_user,
        },
      });
      return check ? true : false;
    }

    private async checkTokenBlackList(token: string) {
      const check = await this.prisma.tokenBlackList.findUnique({
        where: {
          token,
        },
      });

      return check ? true : false;
    }
  }