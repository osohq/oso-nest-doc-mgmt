import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Actor } from '../users/entity/actor';
import { UsersService } from '../users/users.service';
import { getLogger } from 'log4js';

@Injectable()
export class AuthService {
  private readonly logger = getLogger(AuthService.name);


  constructor(private usersService: UsersService) {
  }

  async validateUser(username: string, pass: string): Promise<Actor> {
    this.logger.info("Validating login info for ", username);
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
