import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";

@Injectable()
export class OperationsService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async deleteExpiredEmailCodes() {
        const expirationThreshold = 10 * 60 * 1000;
        const now = Date.now();

        const expired = await this.prisma.emailVerifyCode.deleteMany({
            where: {
                createdAt: {
                    lt: now - expirationThreshold,
                }
            }
        });
    }   
}