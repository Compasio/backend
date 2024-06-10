import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VoluntarysModule } from './modules/voluntary/voluntary.module';
import { OngsModule } from './modules/ongs/ongs.module';
import { VoluntaryRelationsModule } from './modules/voluntary-relations/voluntary-relations.module';
import { OngAssociatedModule } from './modules/ong-associated/ong-associated.module';
import { SysModule } from './modules/sys/sys.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { OperationsModule } from './cron/functions/operations.module';
import { MapsModule } from './modules/maps/maps.module';

@Module({
  imports: [AuthModule, VoluntarysModule, OngsModule, ConfigModule.forRoot({envFilePath: '.env'}), ConfigModule.forRoot({envFilePath: '.debug.env'}), VoluntaryRelationsModule, OngAssociatedModule, SysModule, ScheduleModule.forRoot(), OperationsModule, MapsModule],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {}
