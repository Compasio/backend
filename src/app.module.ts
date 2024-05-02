import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OngsModule } from './modules/ongs/ongs.module';

@Module({
  imports: [AuthModule, UsersModule, OngsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
