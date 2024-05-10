import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VoluntiersModule } from './modules/voluntier/voluntier.module';
import { OngsModule } from './modules/ongs/ongs.module';
import { VoluntierRelationsModule } from './modules/voluntier-relations/voluntier-relations.module';

@Module({
  imports: [AuthModule, VoluntiersModule, OngsModule, ConfigModule.forRoot(), VoluntierRelationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
