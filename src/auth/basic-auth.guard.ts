import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Guest } from '../users/entity/guest';
import { LocalStrategy } from './local.strategy';

@Injectable()
export class BasicAuthGuard extends AuthGuard('local') {
    handleRequest(err, user, info, context, status) {
        return user || new Guest();
    }
}