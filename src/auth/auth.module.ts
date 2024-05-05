import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { jwtSecret } from './constant';

@Module({
  imports: [UsersModule, JwtModule.register({global: true, secret: jwtSecret.secret, signOptions: { expiresIn: '2h' }})],
  providers: [AuthService, {provide: APP_GUARD, useClass: AuthGuard}],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
