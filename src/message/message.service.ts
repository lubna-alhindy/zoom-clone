import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageModel } from './models/message.model';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessage(conferenceId: string) {
    return await this.prisma.message.findMany({
      where: {
        conferenceId: conferenceId
      }
    });
  }

  async addMessage(message: MessageModel) {
    await this.prisma.message.create({
      data: {
        message: message.message,
        user: {
          connect: {
            id: message.userId
          }
        },
        conference: {
          connect: {
            id: message.conferenceId
          }
        }
      }
    });
  }
}
