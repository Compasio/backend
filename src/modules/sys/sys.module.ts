import { Module } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';

@Module({
  controllers: [SysController],
  providers: [SysService],
  exports: [SysService],
})
export class SysModule {}
