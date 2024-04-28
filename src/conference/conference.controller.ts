import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Param,
  Get
} from '@nestjs/common';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateConferenceDto } from './dtos/create-conference.dto';
import { ConferenceService } from './conference.service';
import { RequestUserModel } from 'src/user/models/request-user.model';

@UseGuards(JWTAuthGuard)
@Controller('conference')
export class ConferenceController {
  constructor(private readonly service: ConferenceService) {}

  @Post()
  createConference(
    @Body() body: CreateConferenceDto,
    @Req() request: RequestUserModel
  ) {
    return this.service.createConference(body, request.user.payload);
  }

  @Post('join/:id')
  joinConference(@Param('id') id: string, @Req() request: RequestUserModel) {
    return this.service.joinConference(id, request.user.payload);
  }

  @Post('leave/:id')
  leaveConference(@Param('id') id: string, @Req() request: RequestUserModel) {
    return this.service.leaveConference(id, request.user.payload);
  }

  @Get()
  getAllConferences() {
    return this.service.getAllConferences();
  }
}
