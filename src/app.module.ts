import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConferenceModule } from './conference/conference.module';
import { MockZoomModule } from './mock-zoom/mock-zoom.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ConferenceModule,
    MockZoomModule,
    MessageModule
  ],
  controllers: [AppController]
})
export class AppModule {}
