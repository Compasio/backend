import { Test, TestingModule } from '@nestjs/testing';
import { OngAssociatedService } from './ong-associated.service';

describe('OngAssociatedService', () => {
  let service: OngAssociatedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OngAssociatedService],
    }).compile();

    service = module.get<OngAssociatedService>(OngAssociatedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
