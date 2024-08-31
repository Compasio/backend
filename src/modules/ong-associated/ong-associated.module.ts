import { Module } from '@nestjs/common';
import { OngAssociatedService } from './ong-associated.service';
import { OngAssociatedController } from './ong-associated.controller';
import { PrismaService } from 'src/db/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [OngAssociatedController],
  providers: [OngAssociatedService, PrismaService, AuthService],
  exports: [OngAssociatedService],
})
export class OngAssociatedModule {}
