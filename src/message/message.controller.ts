import { Get, UseGuards, Controller, Param } from '@nestjs/common';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { MessageService } from './message.service';

@UseGuards(JWTAuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @Get(':id')
  getMessage(@Param('id') id: string) {
    return this.service.getMessage(id);
  }
}
