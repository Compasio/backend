import { Module } from '@nestjs/common';
import { CrowdfundingsService } from './crowdfundings.service';
import { CrowdfundingsController } from './crowdfundings.controller';

@Module({
  controllers: [CrowdfundingsController],
  providers: [CrowdfundingsService],
})
export class CrowdfundingsModule {}
