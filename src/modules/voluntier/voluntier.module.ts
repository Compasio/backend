import { Module } from '@nestjs/common';
import { VoluntierService } from './voluntier.service';
import { PrismaService } from '../../db/prisma.service';
import { VoluntiersController } from './voluntier.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [VoluntiersController],
  providers: [VoluntierService, PrismaService, AuthService],
  exports: [VoluntierService],
})
export class VoluntiersModule {}
