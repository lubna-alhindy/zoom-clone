import { Module } from '@nestjs/common';
import { ConferenceService } from './conference.service';
import { ConferenceController } from './conference.controller';
import { MockZoomModule } from 'src/mock-zoom/mock-zoom.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, MockZoomModule],
  controllers: [ConferenceController],
  providers: [ConferenceService]
})
export class ConferenceModule {}
