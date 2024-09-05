import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { PrismaService } from 'src/db/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from '../../auth/auth.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Module({
  imports: [HttpModule],
  controllers: [DonationsController],
  providers: [CloudinaryService, DonationsService, PrismaService, AuthService],
  exports: [DonationsService]
})
export class DonationsModule {}
