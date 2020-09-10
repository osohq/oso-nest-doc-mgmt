import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Actor } from '../users/entity/actor';
import { Guest } from '../users/entity/guest';
import { LocalStrategy } from './local.strategy';
import { getLogger } from 'log4js';

function resolveCredentials(context: ExecutionContext) {
  const request = context.switchToHttp().getRequest();
  return request.body;
}

@Injectable()
export class LocalRejectingAuthGuard extends AuthGuard('local') {
  constructor(private myStrategy: LocalStrategy){
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const credentials = resolveCredentials(context);
    return this.myStrategy.validate(credentials.username, credentials.password)
      .then((actor: Actor) => {
        return actor !== new Guest();
      });
  }
}

@Injectable()
export class LocalResolvingAuthGuard extends AuthGuard('local') {
  private readonly logger = getLogger(LocalResolvingAuthGuard.name);

  constructor(private myStrategy: LocalStrategy) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const credentials = resolveCredentials(context);
    this.logger.info('validating credentials...');
    return this.myStrategy.validate(credentials.username, credentials.password)
      .then((user) => {
        context.switchToHttp().getRequest().user = user;
        this.logger.info('validated user: ', user);
        return true;
      })
      // Unauthenticated users are still allowed the resource; but request.user remains Guest
      .catch(() => true);
  }
}