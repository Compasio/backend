import { Test, TestingModule } from '@nestjs/testing';
import { voluntaryRelationsController } from './voluntary-relations.controller';
import { voluntaryRelationsService } from './voluntary-relations.service';

describe('voluntaryRelationsController', () => {
  let controller: voluntaryRelationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [voluntaryRelationsController],
      providers: [voluntaryRelationsService],
    }).compile();

    controller = module.get<voluntaryRelationsController>(voluntaryRelationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
