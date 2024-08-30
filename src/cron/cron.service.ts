import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { OperationsService } from "./functions/operations.service";

@Injectable()
export class CronService {
    constructor(
        private operations: OperationsService,
    ) {}
    private readonly logger = new Logger(CronService.name);

    @Cron(CronExpression.EVERY_10_MINUTES)
    async deleteExpiredEmailCodes() {
        try {
            const execute = await this.operations.deleteExpiredEmailCodes();
        }
        catch(e) {
            this.logger.debug("Ocorreu um erro:" + e);
        }
        this.logger.debug("deleteExpiredEmailCodes executado");
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async deleteExpiredPasswordCodes() {
        try {
            const execute = await this.operations.deleteExpiredPasswordCodes();
        }
        catch(e) {
            this.logger.debug("Ocorreu um erro:" + e);
        }
        this.logger.debug("deleteExpiredPasswordCodes executado");
    }

    @Cron(CronExpression.EVERY_3_HOURS)
    async clearTokenBlackList() {
        try {
            const execute = await this.operations.clearTokenBlackList();
        }
        catch(e) {
            this.logger.debug("Ocorreu um erro:" + e);
        }
        this.logger.debug("clearTokenBlackList executado");
    }
    
}