import { Test, TestingModule } from '@nestjs/testing';
import { VoluntierRelationsController } from './voluntier-relations.controller';
import { VoluntierRelationsService } from './voluntier-relations.service';

describe('VoluntierRelationsController', () => {
  let controller: VoluntierRelationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoluntierRelationsController],
      providers: [VoluntierRelationsService],
    }).compile();

    controller = module.get<VoluntierRelationsController>(VoluntierRelationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
