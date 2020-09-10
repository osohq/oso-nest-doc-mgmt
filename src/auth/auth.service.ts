import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Guest } from '../users/entity/guest';
import { User } from '../users/entity/user';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

  constructor(private usersService: UsersService) {
  }

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
