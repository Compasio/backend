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
    
}