import { Module } from '@nestjs/common';
import { VoluntaryService } from './voluntary.service';
import { PrismaService } from '../../db/prisma.service';
import { VoluntarysController } from './voluntary.controller';
import { AuthService } from 'src/auth/auth.service';
import { HttpModule } from "@nestjs/axios";
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Module({
  imports: [HttpModule],
  controllers: [VoluntarysController],
  providers: [VoluntaryService, PrismaService, AuthService, CloudinaryService],
  exports: [VoluntaryService],
})
export class VoluntarysModule {}
