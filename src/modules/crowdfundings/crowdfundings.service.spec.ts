import { Test, TestingModule } from '@nestjs/testing';
import { CrowdfundingsService } from './crowdfundings.service';

describe('CrowdfundingsService', () => {
  let service: CrowdfundingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrowdfundingsService],
    }).compile();

    service = module.get<CrowdfundingsService>(CrowdfundingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
