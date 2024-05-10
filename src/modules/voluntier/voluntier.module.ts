import { Module } from '@nestjs/common';
import { VoluntierService } from './voluntier.service';
import { PrismaService } from '../../db/prisma.service';
import { VoluntiersController } from './voluntier.controller';

@Module({
  controllers: [VoluntiersController],
  providers: [VoluntierService, PrismaService],
  exports: [VoluntierService],
})
export class VoluntiersModule {}
