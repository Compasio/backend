import { Test, TestingModule } from '@nestjs/testing';
import { OngAssociatedController } from './ong-associated.controller';
import { OngAssociatedService } from './ong-associated.service';

describe('OngAssociatedController', () => {
  let controller: OngAssociatedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OngAssociatedController],
      providers: [OngAssociatedService],
    }).compile();

    controller = module.get<OngAssociatedController>(OngAssociatedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
