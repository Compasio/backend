import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Injectable()
export class OperationsService {
    constructor(
        private prisma: PrismaService,
        private cloudinary: CloudinaryService,
    ) {}

    async deleteExpiredEmailCodes() {
        const expirationThreshold = 10 * 60 * 1000;
        const now = Date.now();

        const expired = await this.prisma.emailVerifyCode.findMany({
            where: {
                createdAt: {
                    lt: now - expirationThreshold,
                }
            }
        });

        for(let i of expired) {
            const deletePics = await this.cloudinary.deletePic(i.imgId);
            const dele = await this.prisma.emailVerifyCode.delete({
                where: {
                    code: i.code,
                },
            });
        }


    }

    async deleteExpiredPasswordCodes() {
        const expirationThreshold = 10 * 60 * 1000;
        const now = Date.now();

        const expired = await this.prisma.passwordRecCode.deleteMany({
            where: {
                createdAt: {
                    lt: now - expirationThreshold,
                }
            }
        });
    }

    async clearTokenBlackList() {
        try {
            const delRecords = await this.prisma.$executeRawUnsafe('DELETE FROM "TokenBlackList"');
            console.log(delRecords)
            return true
        } catch (error) {
            console.log(error)
            return error;
        }
    }
}