import { Module } from '@nestjs/common';
import { VoluntaryService } from './voluntary.service';
import { PrismaService } from '../../db/prisma.service';
import { VoluntarysController } from './voluntary.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [VoluntarysController],
  providers: [VoluntaryService, PrismaService, AuthService],
  exports: [VoluntaryService],
})
export class VoluntarysModule {}
