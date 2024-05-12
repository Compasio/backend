import { Module } from '@nestjs/common';
import { VoluntierRelationsService } from './voluntier-relations.service';
import { VoluntierRelationsController } from './voluntier-relations.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [VoluntierRelationsController],
  providers: [VoluntierRelationsService, PrismaService],
  exports: [VoluntierRelationsService],
})
export class VoluntierRelationsModule {}
