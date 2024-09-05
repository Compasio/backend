import { Module } from '@nestjs/common';
import { OngsService } from './ongs.service';
import { OngsController } from './ongs.controller';
import { PrismaService } from 'src/db/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { HttpModule } from "@nestjs/axios";
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Module({
  imports: [HttpModule],
  controllers: [OngsController],
  providers: [CloudinaryService, OngsService, PrismaService, AuthService],
  exports: [OngsService]
})
export class OngsModule {}
