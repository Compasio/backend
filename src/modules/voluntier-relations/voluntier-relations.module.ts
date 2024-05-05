import { Module } from '@nestjs/common';
import { VoluntierRelationsService } from './voluntier-relations.service';
import { VoluntierRelationsController } from './voluntier-relations.controller';

@Module({
  controllers: [VoluntierRelationsController],
  providers: [VoluntierRelationsService],
})
export class VoluntierRelationsModule {}
