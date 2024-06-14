import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/db/prisma.service';
import { EmailAuthService } from './emailAuth/emailAuth.service';

@Module({
  imports: [JwtModule.register({global: true, secret: process.env.JWTSECRET, signOptions: { expiresIn: '2h' }})],
  providers: [AuthService, {provide: APP_GUARD, useClass: AuthGuard}, PrismaService, EmailAuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
