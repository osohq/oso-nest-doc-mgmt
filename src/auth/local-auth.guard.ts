import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { LocalStrategy } from './local.strategy';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);

  constructor(private myStrategy: LocalStrategy) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    this.logger.log('validating user');
    return this.myStrategy.validate(body.username, body.password)
      .then((user) => {
        request.user = user;
        return true;
      });
  }
}