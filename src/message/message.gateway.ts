import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { MessageModel } from './models/message.model';
import { UnauthorizedException } from '@nestjs/common';
import { jwtConstant } from 'src/shared/constant/jwt.constant';
import { MessageService } from './message.service';
import { PayloadModel } from 'src/user/models/payload.model';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly service: MessageService) {}

  getUser(client: any) {
    const token = client.handshake.headers.token as string;
    if (!token) {
      throw new UnauthorizedException();
    }
    const { payload } = verify(token, jwtConstant.secret) as any as {
      payload: PayloadModel;
    };
    if (!payload) {
      throw new UnauthorizedException();
    }
    return payload.sub.id;
  }

  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    try {
      const userId = this.getUser(client);
      console.log(userId, 'connected');
    } catch (error) {
      console.log(client.id, 'disconnected');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(client.id, 'disconnected');
  }

  @SubscribeMessage('join-conference')
  joinConference(client: Socket, payload: { conferenceId: string }): void {
    client.join(payload.conferenceId);
  }

  @SubscribeMessage('message')
  sendMessage(client: Socket, payload: MessageModel) {
    try {
      payload.userId = this.getUser(client);
      this.server
        .to(payload.conferenceId)
        .emit('message', { message: payload.message });
      this.service.addMessage(payload);
    } catch (error) {
      console.log(client.id, 'disconnected');
      client.disconnect();
    }
  }
}
