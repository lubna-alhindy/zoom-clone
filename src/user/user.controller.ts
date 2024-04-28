import {
  Get,
  Body,
  Post,
  Request,
  UseGuards,
  Controller
} from '@nestjs/common';
import { UserService } from './user.service';

import { RegisterUserDto } from './dtos/register-user.dto';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { LoginRequestModel } from './models/login-request.model';
import { Serialize } from 'src/shared/serializer/serialize.decorator';
import { UserModel } from './models/user.model';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Post('register')
  @Serialize<UserModel>(UserModel)
  register(@Body() body: RegisterUserDto) {
    return this.service.register(body);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req: LoginRequestModel) {
    return this.service.login(req.user);
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  @Serialize<UserModel>(UserModel)
  getAllUser() {
    return this.service.getAllUser();
  }
}
