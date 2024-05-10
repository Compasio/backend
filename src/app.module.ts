import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VoluntiersModule } from './modules/voluntier/voluntier.module';
import { OngsModule } from './modules/ongs/ongs.module';
import { VoluntierRelationsModule } from './modules/voluntier-relations/voluntier-relations.module';
import { OngAssociatedModule } from './modules/ong-associated/ong-associated.module';

@Module({
  imports: [AuthModule, VoluntiersModule, OngsModule, ConfigModule.forRoot(), VoluntierRelationsModule, OngAssociatedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
