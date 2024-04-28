import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConferenceDto } from './dtos/create-conference.dto';
import { MockZoomService } from 'src/mock-zoom/mock-zoom.service';
import { PayloadModel } from 'src/user/models/payload.model';
import { ConferenceStatus, UserConferenceStatus } from '@prisma/client';

@Injectable()
export class ConferenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mockZoomService: MockZoomService
  ) {}

  async createConference(body: CreateConferenceDto, userPayload: PayloadModel) {
    const userConference = await this.prisma.userConference.findFirst({
      where: {
        userId: userPayload.sub.id,
        status: UserConferenceStatus.in
      }
    });

    if (userConference) {
      throw new BadRequestException('you are inside conference already');
    }

    const zoomConference = await this.mockZoomService.createZoomConference();

    const conference = await this.prisma.conference.create({
      data: {
        name: body.name,
        url: zoomConference.url,
        userConference: {
          create: {
            status: UserConferenceStatus.in,
            isCreator: true,
            user: {
              connect: {
                id: userPayload.sub.id
              }
            }
          }
        }
      }
    });

    return conference;
  }

  async joinConference(id: string, userPayload: PayloadModel) {
    const userConference = await this.prisma.userConference.findFirst({
      where: {
        userId: userPayload.sub.id,
        status: UserConferenceStatus.in
      }
    });
    if (userConference) {
      throw new BadRequestException('you are inside conference already');
    }

    const conference = await this.prisma.conference.findUnique({
      where: {
        id: id
      }
    });

    if (!conference) {
      throw new NotFoundException('conference not found');
    }
    if (conference.status === ConferenceStatus.finished) {
      throw new BadRequestException('conference has finished');
    }

    const joinMockZoomConference =
      await this.mockZoomService.joinZoomConference(
        conference.url,
        userPayload.sub.email
      );

    if (!joinMockZoomConference.result) {
      throw new BadRequestException('error in joining the conference');
    }

    await this.prisma.userConference.create({
      data: {
        status: UserConferenceStatus.in,
        conference: {
          connect: {
            id: conference.id
          }
        },
        user: {
          connect: {
            id: userPayload.sub.id
          }
        }
      }
    });

    return {
      message: 'joined successfully'
    };
  }

  async leaveConference(id: string, userPayload: PayloadModel) {
    const conference = await this.prisma.conference.findUnique({
      where: {
        id: id
      }
    });
    if (!conference) {
      throw new NotFoundException('conference not found');
    }

    const userConference = await this.prisma.userConference.findFirst({
      where: {
        conferenceId: id,
        userId: userPayload.sub.id,
        status: UserConferenceStatus.in
      }
    });
    if (!userConference) {
      throw new NotFoundException('you are not in this conference');
    }

    if (!userConference.isCreator) {
      await this.mockZoomService.leaveZoomConference(
        conference.url,
        userPayload.sub.email
      );
      await this.prisma.userConference.update({
        where: {
          id: userConference.id
        },
        data: {
          status: UserConferenceStatus.out,
          outDate: new Date()
        }
      });
    } else {
      await this.mockZoomService.finishZoomConference(conference.url);
      await this.prisma.conference.update({
        where: {
          id: id
        },
        data: {
          status: ConferenceStatus.finished,
          userConference: {
            updateMany: {
              where: {
                status: UserConferenceStatus.in,
                conferenceId: id
              },
              data: {
                status: UserConferenceStatus.out,
                outDate: new Date()
              }
            }
          }
        }
      });
    }

    return {
      message: 'User left zoom conference successfully'
    };
  }

  async getAllConferences() {
    return await this.prisma.conference.findMany({
      where: {
        status: ConferenceStatus.running
      }
    });
  }
}
