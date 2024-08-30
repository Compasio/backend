import { Module } from '@nestjs/common';
import { OngsService } from './ongs.service';
import { OngsController } from './ongs.controller';
import { PrismaService } from 'src/db/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [OngsController],
  providers: [OngsService, PrismaService, AuthService],
  exports: [OngsService]
})
export class OngsModule {}
