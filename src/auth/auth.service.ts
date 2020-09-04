import { Injectable } from '@nestjs/common';
import { UsersService, User, Guest } from '../users/users.service';
import { getLogger } from 'log4js'

const logger = getLogger('AuthService')

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {
  }

  async validateUser(username: string, pass: string): Promise<User | Guest> {
    logger.info(`in validateUser()`)
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      logger.info('User is valid: ', user)
      return user
    }
    logger.info('user is not valid. Returning guest...')
    return new Guest();
  }
}
