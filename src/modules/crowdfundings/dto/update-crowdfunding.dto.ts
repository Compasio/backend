import { PartialType } from '@nestjs/swagger';
import { CreateCrowdfundingDto } from './create-crowdfunding.dto';

export class UpdateCrowdfundingDto extends PartialType(CreateCrowdfundingDto) {}
