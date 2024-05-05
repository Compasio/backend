import { Test, TestingModule } from '@nestjs/testing';
import { VoluntierRelationsService } from './voluntier-relations.service';

describe('VoluntierRelationsService', () => {
  let service: VoluntierRelationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoluntierRelationsService],
    }).compile();

    service = module.get<VoluntierRelationsService>(VoluntierRelationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
