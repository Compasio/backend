import { Module } from '@nestjs/common';
import { VoluntaryRelationsService } from './voluntary-relations.service';
import { VoluntaryRelationsController } from './voluntary-relations.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [VoluntaryRelationsController],
  providers: [VoluntaryRelationsService, PrismaService],
  exports: [VoluntaryRelationsService],
})
export class VoluntaryRelationsModule {}
