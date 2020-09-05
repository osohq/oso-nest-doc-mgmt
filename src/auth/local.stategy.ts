import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { getLogger } from 'log4js';

const logger = getLogger('LocalStrategy');

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    logger.info(`In LocalStrategy.validate. username: ${username}; password: ${password}`);
    const user = await this.authService.validateUser(username, password);
    logger.info('user:', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}