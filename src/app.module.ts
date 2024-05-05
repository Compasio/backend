import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OngsModule } from './modules/ongs/ongs.module';
import { VoluntierRelationsModule } from './modules/voluntier-relations/voluntier-relations.module';

@Module({
  imports: [AuthModule, UsersModule, OngsModule, ConfigModule.forRoot(), VoluntierRelationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
