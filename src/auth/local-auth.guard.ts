import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { LocalStrategy } from './local.strategy';
import { getLogger } from 'log4js';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = getLogger(LocalAuthGuard.name);

  constructor(private myStrategy: LocalStrategy) {
    super();
    //this.logger.info('')
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    this.logger.info('validating user...');
    return this.myStrategy.validate(body.username, body.password)
      .then((user) => {
        request.user = user;
        this.logger.info('validated user: ', user);
        return true;
      });
  }
}