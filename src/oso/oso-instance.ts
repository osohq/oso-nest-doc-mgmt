import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Oso } from 'oso';
import { Base } from '../base/base.service';
import { Document } from '../document/entity/document';
import { Actor } from '../users/entity/actor';
import { Guest } from '../users/entity/guest';
import { User } from '../users/entity/user';

@Injectable()
export class OsoInstance extends Oso implements CanActivate {
  private readonly init: Promise<void>;
  constructor() {
    super();
    this.init = new Promise((resolve, reject) => {
      this.registerClass(User);
      this.registerClass(Guest);
      this.registerClass(Actor);
      this.registerClass(Document);
      this.registerClass(Base);
      this.registerConstant('console', console);
      const promises:Promise<void>[] = [];
      promises.push(this.loadFile(`${__dirname}/root.polar`));
      promises.push(this.loadFile(`${__dirname}/policy.polar`));
      Promise.all(promises).then(() => resolve()).catch((err) => reject(err));
    });
  }

  async initialized() {
    await this.init;
  }

  canActivate(context: ExecutionContext): boolean {
    context.switchToHttp().getRequest().oso = this;
    return true;
  }

  unauthorized() {
    throw new UnauthorizedException();
  }
}