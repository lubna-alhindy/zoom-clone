import { Module } from '@nestjs/common';
import { MockZoomService } from './mock-zoom.service';

@Module({
  providers: [MockZoomService],
  exports: [MockZoomService]
})
export class MockZoomModule {}
