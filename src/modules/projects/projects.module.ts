import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'src/db/prisma.service';
import { AuthService } from '../../auth/auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, AuthService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
