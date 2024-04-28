import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { isEmail, length, matches } from 'class-validator';
import { Strategy } from 'passport-local';

import { UserService } from '../user.service';
import { passwordRegex } from 'src/shared/util/regex';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private service: UserService) {
    super({
      usernameField: 'email',
      passReqToCallback: false
    });
  }

  async validate(email: string, password: string): Promise<User> {
    if (!isEmail(email)) {
      throw new BadRequestException('email field should be a valid email');
    }
    if (!length(password, 8, 32) && matches(password, passwordRegex)) {
      throw new BadRequestException(
        'password length should be between [8 ,32], and contains characters and numbers'
      );
    }

    const user = await this.service.validateUserCredentials(email, password);
    if (!user) {
      throw new BadRequestException('The email or password is incorrect');
    }
    return user;
  }
}
