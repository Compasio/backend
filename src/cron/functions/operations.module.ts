import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { PrismaService } from 'src/db/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Module({
    providers: [CloudinaryService, OperationsService, PrismaService],
    exports: [OperationsService]
})
export class OperationsModule {}