import { Module } from '@nestjs/common';
import { CrowdfundingsService } from './crowdfundings.service';
import { CrowdfundingsController } from './crowdfundings.controller';
import { PrismaService } from 'src/db/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CrowdfundingsController],
  providers: [CrowdfundingsService, PrismaService, AuthService],
  exports: [CrowdfundingsService]
})
export class CrowdfundingsModule {}
