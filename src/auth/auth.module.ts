import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { jwtSecret } from './constant';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  imports: [JwtModule.register({global: true, secret: jwtSecret.secret, signOptions: { expiresIn: '2h' }})],
  providers: [AuthService, {provide: APP_GUARD, useClass: AuthGuard}, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
