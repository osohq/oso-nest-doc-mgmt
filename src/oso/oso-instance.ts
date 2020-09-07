import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Oso } from 'oso';
import { Base } from '../base/base.service';
import { Document } from '../document/entity/document';
import { Actor } from '../users/entity/actor';
import { Guest } from '../users/entity/guest';
import { User } from '../users/entity/user';

@Injectable()
export class OsoInstance extends Oso implements CanActivate {
  constructor() {
    super();
    this.registerClass(User);
    this.registerClass(Guest);
    this.registerClass(Actor);
    this.registerClass(Document);
    this.registerClass(Base);
    this.registerConstant('console', console);
    this.loadFile(__dirname + '/root.polar');
    this.loadFile(__dirname + '/policy.polar');
  }

  canActivate(context: ExecutionContext): boolean {
    context.switchToHttp().getRequest().oso = this;
    return true;
  }

  // isAllowed(actor: unknown, action: unknown, resource: unknown): Promise<boolean> {
  //   return super.isAllowed(actor, action, resource);
  // }

  unauthorized() {
    throw new UnauthorizedException();
  }
}