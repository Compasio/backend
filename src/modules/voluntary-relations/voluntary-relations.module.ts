import { Module } from '@nestjs/common';
import { VoluntaryRelationsService } from './voluntary-relations.service';
import { VoluntaryRelationsController } from './voluntary-relations.controller';
import { PrismaService } from 'src/db/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { HttpModule } from '@nestjs/axios';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Module({
  imports: [HttpModule],
  controllers: [VoluntaryRelationsController],
  providers: [CloudinaryService, VoluntaryRelationsService, PrismaService, AuthService],
  exports: [VoluntaryRelationsService],
})
export class VoluntaryRelationsModule {}
