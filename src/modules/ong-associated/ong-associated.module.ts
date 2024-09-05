import { Module } from '@nestjs/common';
import { OngAssociatedService } from './ong-associated.service';
import { OngAssociatedController } from './ong-associated.controller';
import { PrismaService } from 'src/db/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { HttpModule } from '@nestjs/axios';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Module({
  imports: [HttpModule],
  controllers: [OngAssociatedController],
  providers: [CloudinaryService, OngAssociatedService, PrismaService, AuthService],
  exports: [OngAssociatedService],
})
export class OngAssociatedModule {}
