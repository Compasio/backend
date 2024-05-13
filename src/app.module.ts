import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VoluntarysModule } from './modules/voluntary/voluntary.module';
import { OngsModule } from './modules/ongs/ongs.module';
import { VoluntaryRelationsModule } from './modules/voluntary-relations/voluntary-relations.module';
import { OngAssociatedModule } from './modules/ong-associated/ong-associated.module';

@Module({
  imports: [AuthModule, VoluntarysModule, OngsModule, ConfigModule.forRoot(), VoluntaryRelationsModule, OngAssociatedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
