import { Injectable, NestInterceptor } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { CallHandler } from '@nestjs/common/interfaces/features/nest-interceptor.interface';
import { getLogger } from 'log4js';
import { Observable } from 'rxjs';
import { Guest } from './entity/guest';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  private readonly logger = getLogger(UsersInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    this.logger.info('User in request: ', request.user);
    if (!request.user) {
      this.logger.info('User is undefined; setting user to Guest');
      request.user = new Guest();
    }
    return next.handle();
  }
}