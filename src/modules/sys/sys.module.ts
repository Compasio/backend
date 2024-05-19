import { Module } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [SysController],
  providers: [SysService, PrismaService],
  exports: [SysService],
})
export class SysModule {}
