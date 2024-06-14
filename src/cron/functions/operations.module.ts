import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
    providers: [OperationsService, PrismaService],
    exports: [OperationsService]
})
export class OperationsModule {}