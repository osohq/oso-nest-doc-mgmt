import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(BasicStrategy, 'local') {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username?: string, password?: string): Promise<any> {
    console.log(`Attempting to login as ${username}`)
    return await this.authService.validateUser(username, password);
  }
}