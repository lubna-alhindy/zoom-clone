import { Test, TestingModule } from '@nestjs/testing';
import { MockZoomService } from './mock-zoom.service';

describe('MockZoomService', () => {
  let service: MockZoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockZoomService],
    }).compile();

    service = module.get<MockZoomService>(MockZoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
