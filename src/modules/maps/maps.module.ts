import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [MapsController],
  providers: [MapsService, PrismaService],
  exports: [MapsService],
})
export class MapsModule {}
