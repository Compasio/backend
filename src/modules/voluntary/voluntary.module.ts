import { Module } from '@nestjs/common';
import { VoluntaryService } from './voluntary.service';
import { PrismaService } from '../../db/prisma.service';
import { VoluntarysController } from './voluntary.controller';
import { AuthService } from 'src/auth/auth.service';
import { EmailAuthService } from 'src/auth/emailAuth/emailAuth.service';

@Module({
  controllers: [VoluntarysController],
  providers: [VoluntaryService, PrismaService, AuthService, EmailAuthService],
  exports: [VoluntaryService],
})
export class VoluntarysModule {}
