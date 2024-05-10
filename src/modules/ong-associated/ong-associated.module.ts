import { Module } from '@nestjs/common';
import { OngAssociatedService } from './ong-associated.service';
import { OngAssociatedController } from './ong-associated.controller';

@Module({
  controllers: [OngAssociatedController],
  providers: [OngAssociatedService],
})
export class OngAssociatedModule {}
