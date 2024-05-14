import { Test, TestingModule } from '@nestjs/testing';
import { voluntaryRelationsService } from './voluntary-relations.service';

describe('voluntaryRelationsService', () => {
  let service: voluntaryRelationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [voluntaryRelationsService],
    }).compile();

    service = module.get<voluntaryRelationsService>(voluntaryRelationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
