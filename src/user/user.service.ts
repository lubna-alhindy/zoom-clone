import { Injectable, BadRequestException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { RegisterUserDto } from './dtos/register-user.dto';
import { PayloadModel } from './models/payload.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { hashString, validateString } from 'src/shared/util/helpers';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async register(body: RegisterUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email
      }
    });

    if (user) {
      throw new BadRequestException('This account already exist');
    }

    return await this.prisma.user.create({
      data: {
        email: body.email,
        fullName: body.fullName,
        password: await hashString(body.password)
      }
    });
  }

  async login(user: User) {
    const payload: PayloadModel = {
      sub: {
        id: user.id,
        email: user.email
      }
    };

    return {
      accessToken: this.jwtService.sign({
        payload
      })
    };
  }

  async getAllUser() {
    return await this.prisma.user.findMany();
  }

  async validateUserCredentials(
    email: string,
    password: string
  ): Promise<null | User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user || !(await validateString(password, user.password))) return null;
    return user;
  }
}
