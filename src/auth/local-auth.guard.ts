import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getLogger} from 'log4js';
const logger = getLogger('LocalAuthGuard');

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
    logger.info('handleRequest()...');
    const handled = super.handleRequest(err, user, info, context, status);
    logger.info('handled: ', handled);
    return handled;
  }
}