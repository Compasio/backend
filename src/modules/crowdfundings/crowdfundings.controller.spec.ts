import { Test, TestingModule } from '@nestjs/testing';
import { CrowdfundingsController } from './crowdfundings.controller';
import { CrowdfundingsService } from './crowdfundings.service';

describe('CrowdfundingsController', () => {
  let controller: CrowdfundingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrowdfundingsController],
      providers: [CrowdfundingsService],
    }).compile();

    controller = module.get<CrowdfundingsController>(CrowdfundingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
