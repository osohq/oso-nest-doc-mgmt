import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getLogger, Logger } from 'log4js';
import { Observable } from 'rxjs';
import { Actor } from '../users/entity/actor';
import { LocalStrategy } from './local.strategy';

function resolveCredentials(context: ExecutionContext) {
  const request = context.switchToHttp().getRequest();
  return request.body;
}

@Injectable()
export class LocalRejectingAuthGuard extends AuthGuard('local') {
  private readonly logger: Logger;

  constructor(private myStrategy: LocalStrategy) {
    super();
    this.logger = getLogger(LocalRejectingAuthGuard.name);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const credentials = resolveCredentials(context);
    this.logger.info('validating credentials: ', credentials);
    return this.myStrategy.validate(credentials.username, credentials.password)
      .then((actor: Actor) => {
        this.logger.info('found actor: ', actor);
        return !actor.isGuest();
      }).catch((err) => {
        this.logger.info('No joy: ', err);
        return false;
      });
  }
}

@Injectable()
export class LocalResolvingAuthGuard extends AuthGuard('local') {
  private readonly logger: Logger = getLogger(LocalResolvingAuthGuard.name);

  constructor(private myStrategy: LocalStrategy) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const credentials = resolveCredentials(context);
    this.logger.info('validating credentials: ', credentials);
    return this.myStrategy.validate(credentials.username, credentials.password)
      .then((user) => {
        context.switchToHttp().getRequest().user = user;
        this.logger.info('validated user: ', user);
        return true;
      })
      // Unauthenticated users are still allowed access to the resource; but request.user remains Guest
      .catch(() => true);
  }
}